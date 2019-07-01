// @flow
import _ from "lodash";
import moment from "moment";

import React from "react";
import { StyleSheet, ScrollView  } from 'react-native';
import { Content, View } from "native-base";
import { Title } from "../../components";
import AppStore from "../../app/AppStore";

import type {
  MeasurementType,
  DailyEvaluationObject,
  IRegimen
} from "../../libs/scijs"
import { 
  MeasurementTypes,
  BaclofenUtils,
  NotExistError,
  fakeDailyEvals,
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
// const { Circle, Rect, G } = Svg; 


const appStore: AppStore = new AppStore();

type State = {
  trackedMeasurementTypes: MeasurementType[],
  selectedMeasurementTypes: string[],
}

const SCOPE = "AnalysisMainScreen";
const X_AXIS_PADDING = 2;
const Y_AXIS_PADDING = 0.5;
const MIN_MEASUREMENT_SCORE = 0;
const MAX_MEASUREMENT_SCORE = 5;

export default class AnalysisMainScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: "Analysis"
  }

  state = {
    trackedMeasurementTypes: [],
    selectedMeasurementTypes: [],
  }

  dailyEvalDataFrame = new DailyEvalDataFrame()

  componentDidMount() {
    console.log(SCOPE, "componentDidMount");
    this.initializeState()
  }

  async initializeState() {
    try { 
      let regimen = await appStore.getLatestRegimen();
      this.dailyEvalDataFrame = await this.createDailyEvalDataFrame(regimen);
      this.dailyEvalDataFrame.summarize();

      this.setState({
        trackedMeasurementTypes: regimen.getTrackedMeasurementTypes(),
        selectedMeasurementTypes: [regimen.getTrackedMeasurementTypes()[0]],
      })
    // console.log(this.dailyEvalDataFrame)
    } catch(e) {
      console.log(e)
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
    // let startDate = regimen.startDate;
    // let today = moment().format(DateFormatISO8601);
    // return await appStore.getDailyEvalsByDateRange(
    //   startDate,
    //   today
    // )
    return fakeDailyEvals
  }

  async convertDailyEvalsToDataPoints(regimen: IRegimen, dailyEvals: DailyEvaluationObject[]) {
    let allPoints: DailyEvalDataPoint[] = [];

    dailyEvals.forEach( (dailyEval) => {
      let dosage = this.getDosage(regimen, dailyEval);
      let points = AnalysisUtils.convertDailyEvalObjToDataPoints(dailyEval, dosage);
      allPoints = allPoints.concat(points);
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

  render() {
    return (
      <ScrollView>
        <Content contentContainerStyle={styles.mainView}>
          <Title style = {styles.title}>Symptom and side effects under different dosages</Title> 
          {this.renderSelectionButtons()}
          {this.renderChart()}
        </Content>
      </ScrollView>
    )
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
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
    height: 50,
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
