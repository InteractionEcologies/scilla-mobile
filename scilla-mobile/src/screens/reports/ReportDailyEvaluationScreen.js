// @flow
import React, { Fragment} from "react";

import {
  IRegimen
} from "../../libs/scijs";
import type {
  MeasurementObject,
  MeasurementType,
  MeasurementValue,
  DailyEvaluationObject
} from "../../libs/scijs"

import { Text, View, Icon, Button, Card, CardItem, Right, Toast } from "native-base";
import { ScrollView, StyleSheet } from "react-native";
import { AppText, Title, DotPageIndicator } from "../../components";
// import styles from "./ReportStyles"; 

import MeasurementScaleViewFactory from "./views/MeasurementScaleViewFactory";

import { ScreenNames } from "../../constants/Screens";
import AppService from "../../services/AppService";
import AppStore from "../../services/AppStore";
import AppClock from "../../services/AppClock";
import UsageLogger, { UsageEvents } from "../../services/UsageLogger";

import moment from "moment";
import _ from "lodash";
import XDate from "xdate";

import { 
  RequiredAdditionalIllinessMeasurementTypes,
  RequiredAdditionalTreatmentMeasurementTypes, 
  RequiredAdditionalMeasurementTypes, 
  DailyEvalQuestionPriorityMap,
  AdditionalMeasurementViewTypes
} from "./constants";

const appStore = AppStore.instance;
const appService = AppService.instance;
const appClock = AppClock.instance; 
const logger = UsageLogger.instance;

type State = {
  selectedDate: string,
  regimen: ?IRegimen, 
  dailyEvalObj: ?DailyEvaluationObject,
  measurementsByType: {
    [key: MeasurementType]: MeasurementValue
  },
  inSituMeasurements: MeasurementObject[],
  measurementViewStates: string[],
  step: number
}

// eslint-disable-next-line no-unused-vars
const SCOPE = "ReportDailyEvaluationScreen";
export default class ReportDailyEvaluationScreen extends React.Component<any, State> {

  static navigationOptions: any = {
    title: 'Daily Report'
  };

  state = {
    selectedDate: this.props.navigation.getParam('selectedDate', null),
    regimen: null, 
    dailyEvalObj: null, 
    measurementsByType: {},
    inSituMeasurements: [],
    step: 0,
    measurementViewStates: []
  }

  newDailyEvalReport = null;
  
  componentWillFocusSubscription: any;

  constructor(props: any) {
    super(props);
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    )
  }

  componentDidMount() {
    logger.logEvent(UsageEvents.report_daily_begin);
  }

  componentWillFocus = (payload: any) => {
    // console.info("willFocus", payload);
    
    this.initializeState();
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  async initializeState() {
    let regimen: ?IRegimen = await this.fetchRegimen();
    if(regimen == null) return;

    // look up existing daily eval 
    let date = moment(this.state.selectedDate);
    let report: ?DailyEvaluationObject = await this.fetchDailyEvalByDate(date);
    console.log(SCOPE, "report", report);

    // init measurementsByType
    let measurementsByType;
    if(report) {
      measurementsByType = report.measurementsByType;
    } else {
      measurementsByType = this._createInitialMeasurementsByType(regimen);
    }

    let inSituMeasurements = await this.fetchMeasurementsByDate(date);
    let measurementViewStates = this.createMeasurementViewStates(measurementsByType);

    // Set 
    this.setState({
      regimen: regimen, 
      dailyEvalObj: report, 
      measurementsByType: measurementsByType,
      inSituMeasurements: inSituMeasurements,
      measurementViewStates: measurementViewStates
    })

  }

  async fetchRegimen(): Promise<?IRegimen> {
    try {
      let regimen = await appStore.getLatestRegimen();
      return regimen;
    } catch(e) {
      console.log(SCOPE, e);
      return null;
    }
  }

  async fetchDailyEvalByDate(date: moment): Promise<?DailyEvaluationObject> {
    try {
      return await appStore.getDailyEvalByDate(date);
      // this.setState({
      //   measurementsByType: dailyEvalReportObj.measurementsByType,
      //   dailyEvalReportObjId: dailyEvalReportObj.id
      // }, ()=>{this._createMeasurementViewStates()}
    } catch (e) {
      if(e.name === 'NotExistError'){
        // Look up required measurementTypes
        // this._createInitialMeasurementsByType();
        console.log(SCOPE, 'cannot find daily eval')  
        return null;
      }
    }
  }

  async fetchMeasurementsByDate(date: moment): Promise<MeasurementObject[]> {
    try {
      return await appStore.getMeasurementsByDate(date);
      // let allMeasurements = await appStore.getMeasurementsByDate('2018-11-26');
      // this.setState({
      //   inSituMeasurements: allMeasurements
      // })
    } catch (e) {
        console.log(e);
        return [];
    }
  }

  
  _createInitialMeasurementsByType(regimen: IRegimen){
    return {
      ...this._initMeasurementsByType(regimen.getTrackedMeasurementTypes(), 0),
      ...this._initMeasurementsByType(RequiredAdditionalIllinessMeasurementTypes, false),
      ...this._initMeasurementsByType(RequiredAdditionalTreatmentMeasurementTypes, false),
      ...this._initMeasurementsByType(RequiredAdditionalMeasurementTypes, '')  
    }
  }

  /**
   * Return an Object with key being a MeasurementType 
   */
  _initMeasurementsByType = (measurementTypes: MeasurementType[], initialValue: MeasurementValue): Object => {
    let initialMeasurementObj = {};
    for(let type of measurementTypes){
      initialMeasurementObj[type] = initialValue;
    }
    return initialMeasurementObj;
  }


  createMeasurementViewStates = (measurementsByType: Object) =>{
    let optionalMeasurementTypes = _.keys(measurementsByType)
                                      .filter((type)=>this._isOptionalMeasurementType(type));
    optionalMeasurementTypes = this._sortMeasurementTypesByPriority(optionalMeasurementTypes);
    return [
      ...optionalMeasurementTypes, 
      AdditionalMeasurementViewTypes.additionalIlliness,
      AdditionalMeasurementViewTypes.additionalTreatment,
      ...RequiredAdditionalMeasurementTypes
    ];
  }

  _isOptionalMeasurementType = (type:string) =>{
    return (!RequiredAdditionalMeasurementTypes.includes(type) && 
            !RequiredAdditionalTreatmentMeasurementTypes.includes(type) &&
            !RequiredAdditionalIllinessMeasurementTypes.includes(type))
  }

  _sortMeasurementTypesByPriority = (measurementTypes: MeasurementType[]) => {
    // convert to an array of object based on priority definition first
    let measurementTypesWithPriority = _.map(measurementTypes, (type: MeasurementType) => {
      return {
        type: type,
        priority: _.get(DailyEvalQuestionPriorityMap, type, 1000)
      }
    });

    measurementTypesWithPriority = _.sortBy(measurementTypesWithPriority, 'priority');
    let sortedMeasurementTypes = _.map<any, any>(measurementTypesWithPriority, (obj: any) => {
      return obj.type
    });
    return sortedMeasurementTypes;
  }

  updateSelectedScaleValue = (type: string, value: MeasurementValue) =>{
    console.log(SCOPE, "updateSelectedScaleValue", type, value);
    let measurementsByType = {...this.state.measurementsByType}
    measurementsByType[type] = value
    this.setState(
      {measurementsByType}
    )
    console.log(measurementsByType)
  }

  onDayPressed = (day: XDate) => {
    this.setState({
      selectedDate: day.dateString
    })
  }

  onMeasurementValuesConfirmed = () => {
    console.log("save daily report object");
    if(this.state.measurementsByType){
      this._createDailyEvalReport(this.state.measurementsByType)
    }
    this.newDailyEvalReport = null
    this.setState({
        step: 0
      });
    this._showToast();
    logger.logEvent(UsageEvents.report_daily_complete);
  }

  _createDailyEvalReport = (meaurementsByType: {[key: MeasurementType]:MeasurementValue}) => {
    const { regimen, dailyEvalObj } = this.state;
    if(regimen == null) return;

    let user = appService.auth.currentUser;
    let uid = user.uid;
    let regimenId = regimen.id;
    let regimenPhase = regimen.getRegimenPhaseByDate(moment(this.state.selectedDate));

    if(regimenPhase == null && regimen.completed) {
      regimenPhase = regimen.getActiveRegimenPhase();
    } 
    if(regimenPhase == null) return;

    let id = null;
    if(dailyEvalObj) {
      id = dailyEvalObj.id;
    }
    let newDailyEvalReport = {
        id: id || appService.generatePushID(), 
        uid: uid,
        date: this.state.selectedDate, 
        createdAtTimestamp: appClock.now().unix(),
        regimenId: regimenId, 
        regimenPhase: regimenPhase.phase,
        measurementsByType: meaurementsByType
    }
    appStore.updateDailyEval(newDailyEvalReport);
    
    this.newDailyEvalReport = newDailyEvalReport;
  }

  _showToast = () =>{
    Toast.show({
      text: 'Daily evaluation report saved!',
      buttonText: 'OK'
    })
  }

  goToNext = () =>{
    if (this.state.step === this.state.measurementViewStates.length-1){
      this.onMeasurementValuesConfirmed();
      this.props.navigation.navigate(ScreenNames.ReportMain);
    } else {
        this.setState({
        step: this.state.step+1
      })
    }
  }

  goToPrevious = () =>{
    if (this.state.step === 0){
      this.props.navigation.navigate(ScreenNames.ReportMain)
      this.setState({
        step: 0
      })
    } else {
        this.setState({
        step: this.state.step-1
      })
    }
  }

  setNextBtnText(){
    if(this.state.step === this.state.measurementViewStates.length-1){
      return 'Done'
    } else {
      return 'Next'
    }
  }

  renderInSituReportView = (measurementType:string) => {
    let inSituReport; 
    if (this._isOptionalMeasurementType(measurementType)){
      inSituReport = 
        <Card style={styles.inSituCard}>
          <CardItem header bordered>
            <Title>Your {measurementType} Memos</Title>
          </CardItem>
          {this._renderInSituMeasurements(measurementType)}
        </Card>
    }
    return inSituReport; 
  }

  _renderInSituMeasurements = (measurementType:string):any => {
    let inSituReportArr = []
    if(this.state.inSituMeasurements){
      inSituReportArr = this.state.inSituMeasurements
                        .filter(measurement => measurement.type === measurementType)
    }
    if (inSituReportArr.length > 0){
      return (
        inSituReportArr.map((report: MeasurementObject,i: number):any => {
          return(
            <CardItem bordered key={i}>
              <AppText>{moment.unix(report.timestamp).format("h:mm A")}</AppText>
              <Right><AppText>{measurementType} {report.value}</AppText></Right>
            </CardItem>
          );
        })
      );
    } else {
      return(
        <CardItem>
          <Text>None</Text>
        </CardItem>
      );
    }  
  }

  renderScaleView(measurementViewState: string){
    const { measurementsByType } = this.state;
    
    // Can be a MeasurementValue or an Object with key as MeasurementType. 
    // The latter case is used for non-standalone scale such as checkboxes. 
    // FIXME: This is Dora's interface design. Not ideal, but will live with it now.  
    let initialValue: any; 

    let view;
    console.log(SCOPE, "renderScaleView", measurementViewState);
    if(measurementViewState === AdditionalMeasurementViewTypes.additionalIlliness) {
      initialValue = {};
      RequiredAdditionalIllinessMeasurementTypes.forEach((type: string) => {
        initialValue[type] = measurementsByType[type]
      })
    } else if (measurementViewState === AdditionalMeasurementViewTypes.additionalTreatment) {
      initialValue = {};
      RequiredAdditionalTreatmentMeasurementTypes.forEach((type: string) => {
        initialValue[type] = measurementsByType[type]
      });
    } else {
      initialValue = measurementsByType[measurementViewState]
    }
    
    view = MeasurementScaleViewFactory.createView(
      measurementViewState,
      initialValue, 
      this.updateSelectedScaleValue
    )
    
    let title = "Rate today's overall symptom"
    if(measurementViewState === AdditionalMeasurementViewTypes.additionalIlliness) {
      title = "Additional illiness experience"
    } else if (measurementViewState === AdditionalMeasurementViewTypes.additionalTreatment) {
      title = "Additional treatment you've received"
    } else {
      title = measurementViewState;
    }
    return(
      <Card style={styles.card}>
        {/* <CardItem header bordered>
        <Title style={{flex: 1}}>{title}</Title>
        </CardItem> */}
        <CardItem style={styles.cardItem}>
        {view}
        </CardItem>
      </Card>
    );
  }


  render(){
    let { selectedDate } = this.state;
    let measurementType = this.state.measurementViewStates[this.state.step];

    const friendlyDateStr = moment(selectedDate).format("dddd, MMM Do")

    return(
      <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <Title style={styles.titleText}>{friendlyDateStr}</Title>   
            <DotPageIndicator 
              totalDots={this.state.measurementViewStates.length}
              activeDotIndex={this.state.step}
            />
          </Card>
          {measurementType &&
            <Fragment>
              {this.renderScaleView(measurementType)}
              {this.renderInSituReportView(measurementType)}
            </Fragment>
          }
          <View style={styles.nextBackBtnView}>
            <Button 
              iconLeft 
              bordered={true} 
              style={styles.button} 
              onPress={this.goToPrevious}>
              <Icon name="arrow-back"/>
              <AppText style={styles.btnTextLeft}>Back</AppText>
            </Button>
            <Button 
              iconRight 
              style={styles.button} 
              onPress={this.goToNext} 
              >
              <AppText style={styles.btnTextRight}>{this.setNextBtnText()}</AppText>
              <Icon name="arrow-forward"/>
            </Button>
          </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    width: '100%', 
    paddingRight: 10, 
    paddingLeft: 10
  },
  card: {
  },
  cardItem: {
    width: '100%',
  },  
  nextBackBtnView: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 20,
  },  
  button: {
    width: 130
  },
  btnTextLeft: {
    textAlign: 'center'
  },
  btnTextRight: {
    textAlign: 'center'
  }
});