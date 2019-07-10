// @flow
import _ from "lodash";
import moment from "moment";

import React, { Fragment } from "react";
import { StyleSheet, ScrollView  } from 'react-native';
import { View } from "native-base";
import { Title, AppText } from "../../components";
import AppStore from "../../services/AppStore";

import type {
  MeasurementType,
  DailyEvaluationObject,
  IRegimen
} from "../../libs/scijs"
import { 
  MeasurementTypes,
  BaclofenUtils,
  // fakeDailyEvals,
  IRegimenPhase
} from "../../libs/scijs"; 

import { AnalysisUtils } from "../../models/analysis/utils";
import type { DailyEvalDataPoint } from "../../models/analysis";
import { DailyEvalDataFrame } from "../../models/analysis/";
import { PlottableMeasurementTypes} from "./constants";
import { MeasurementSelectionBtn } from "./views/MeasurementSelectionBtn";
// import { Svg } from "expo";
import { ScatterPlot } from "./views/ScatterPlot";
import { DotPlot } from "./views/DotPlot";

import AppClock from "../../services/AppClock";
import Colors from "../../constants/Colors";
// const { Circle, Rect, G } = Svg; 


const appStore: AppStore = AppStore.instance;
const appClock: AppClock = AppClock.instance;



const X_AXIS_PADDING = 2;
const Y_AXIS_PADDING = 0.5;
const MIN_MEASUREMENT_SCORE = 0;
const MAX_MEASUREMENT_SCORE = 5;

type State = {
  trackedMeasurementTypes: MeasurementType[],
  selectedMeasurementTypes: string[],
  hasRegimen: boolean
}

const SCOPE = "AnalysisMainScreen";
export default class AnalysisMainScreen extends React.Component<any, State> {
  componentWillFocusSubscription: any;

  static navigationOptions: any = {
    title: "Trend"
  }

  state = {
    trackedMeasurementTypes: [],
    selectedMeasurementTypes: [],
    hasRegimen: false
  }

  dailyEvalDataFrame = new DailyEvalDataFrame()

  constructor(props: any) {
    super(props);
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    );
  }

  componentDidMount() {
    console.log(SCOPE, "componentDidMount");
    
  }

  componentWillFocus = async (payload: any) => { 
    this.initializeState()
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  async initializeState() {
    try { 
      let regimen = await appStore.getLatestRegimen();
      this.dailyEvalDataFrame = await this.createDailyEvalDataFrame(regimen);
      this.dailyEvalDataFrame.summarize();

      this.setState({
        hasRegimen: true,
        trackedMeasurementTypes: regimen.getTrackedMeasurementTypes(),
        selectedMeasurementTypes: [regimen.getTrackedMeasurementTypes()[0]],
      })
    // console.log(this.dailyEvalDataFrame)
    } catch(e) {
      console.log(e);
      this.setState({
        hasRegimen: false
      })
    }
  }

  async createDailyEvalDataFrame(regimen: IRegimen) {
    let dailyEvals = await this.getDailyEvals(regimen);
    let dataPoints = await this.convertDailyEvalsToDataPoints(regimen, dailyEvals);
    let dataframe = new DailyEvalDataFrame();
    dataframe.addDataPoints(dataPoints);
    return dataframe;
  }

  async getDailyEvals(regimen: IRegimen) {
    let startDate = regimen.startDate;
    let today = appClock.now();

    return await appStore.getDailyEvalsByDateRange(
      startDate,
      today
    )
    // return fakeDailyEvals
  }

  async convertDailyEvalsToDataPoints(regimen: IRegimen, dailyEvals: DailyEvaluationObject[]) {
    let allPoints: DailyEvalDataPoint[] = [];

    dailyEvals.forEach( (dailyEval) => {
      console.log(SCOPE, dailyEval);
      let dosage = this.getDosage(regimen, dailyEval);
      // FIXME: Currently only show daily evaluations reported in the latest regimen. 
      if(dosage !== -1) {
        let points = AnalysisUtils.convertDailyEvalObjToDataPoints(dailyEval, dosage);
        allPoints = allPoints.concat(points);
      }
    })
    return allPoints;
  }

  getDosage(regimen: IRegimen, dailyEval: DailyEvaluationObject): number {
    let regimenPhase = this.getRegimenPhaseOfDailyEval(regimen, dailyEval);
    if(regimenPhase) {
      return BaclofenUtils.getDosageByRegimenPhase(regimenPhase);
    } else {
      return parseInt(dailyEval.measurementsByType[MeasurementTypes.baclofenAmount], 10) || -1;
    }
  }

  getRegimenPhaseOfDailyEval(
    regimen: IRegimen, 
    dailyEval: DailyEvaluationObject): ?IRegimenPhase
  {
    let regimenId = dailyEval.regimenId; 
    let phase = dailyEval.regimenPhase; 

    let regimenPhase = regimen.getRegimenPhaseByDate(moment(dailyEval.date));

    if(regimenPhase == null) { return null }
    if(regimen.id === regimenId && regimenPhase.phase === phase) {
      return regimenPhase
    } else {
      return null;
    }
  }

  renderSelectionButtons = (): any => {
    let plottableTypes = []
    this.state.trackedMeasurementTypes.forEach(type=>{
       if(_.includes(PlottableMeasurementTypes, type)){
          plottableTypes.push(type)
      }
    })

    let buttons = plottableTypes.map( (type: string, i: number): any => {
      let selected: boolean = this.state.selectedMeasurementTypes.includes(type)
      return (
        <MeasurementSelectionBtn
          key = {i}
          measurementType = {type}
          selected = {selected}
          style = {styles.btn}
          onPress = {() => this._onBtnPress(type)}
        />
      );
    })
    return (
      <View style={styles.btnView}>
        {buttons}
      </View>
    )
  }

  _onBtnPress = (pressedType:string) => {
      if(this.state.selectedMeasurementTypes.includes(pressedType)){
        let selectedMeasurementTypes = this.state.selectedMeasurementTypes.filter(type=>type!==pressedType)
        this.setState({
          selectedMeasurementTypes
        })
      } else {
        this.setState({
          selectedMeasurementTypes: [...this.state.selectedMeasurementTypes, pressedType]
        })
      }
  }

  renderChart = () => {
    let meanDataPointsByType = this.dailyEvalDataFrame
                                  .getMeanDataPointsByTypes(this.state.selectedMeasurementTypes)

    if(this.state.selectedMeasurementTypes.length !== 1) {

      console.log("render scatter plot");
      return <ScatterPlot 
        width={400}
        height={400}
        selectedMeasurementTypes={this.state.selectedMeasurementTypes}
        meanDataPoints={meanDataPointsByType}
        xDomain={[0 - X_AXIS_PADDING, 30 + X_AXIS_PADDING]}
        yDomain={[
          MIN_MEASUREMENT_SCORE - Y_AXIS_PADDING, 
          MAX_MEASUREMENT_SCORE + Y_AXIS_PADDING
        ]}
        xTicks={[0, 5, 10, 15, 20, 25, 30]}
      />      
    } else {
        let dataPoints = this.dailyEvalDataFrame
                          .getDisplacedDataPointsByType(this.state.selectedMeasurementTypes[0])

        console.log("render dot plot");
        return <DotPlot
          width={400}
          height={400}
          selectedMeasurementTypes={this.state.selectedMeasurementTypes}
          meanDataPoints={meanDataPointsByType}
          dotDataPoints={dataPoints}
          xDomain={[0 - X_AXIS_PADDING, 30 + X_AXIS_PADDING]}
          yDomain={[
            MIN_MEASUREMENT_SCORE - Y_AXIS_PADDING, 
            MAX_MEASUREMENT_SCORE + Y_AXIS_PADDING
          ]}
          xTicks={[0, 5, 10, 15, 20, 25, 30]}
        />
    }
  }


  render() {
    const { hasRegimen } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Title style = {styles.title}>Symptom Trend</Title> 
        {!hasRegimen && 
          <AppText>You do not have a regimen yet. Please redeem one first.</AppText>
        }
        {hasRegimen &&
          <Fragment>
            {this.renderSelectionButtons()}
            {this.renderChart()}
          </Fragment>
        }
        
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1, 
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.surfaceColor
  },
  btnView:{
    height: 50,
    width: 340,
    flexDirection: "row",
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 50,
  },
  btn: {
    // height: 50,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: null,
    borderColor: null, 
    width: 155,
    justifyContent: 'center',
  },
  title: {
    marginTop: 30,

  }
})
