// @flow
import React from "react";
import { Container, Content, Text, View, Icon, Button, Card, CardItem, Right, Toast } from "native-base";
import { ScrollView } from "react-native";
import { AppText, Title, DotPageIndicator } from "../../components";
import AppService from "../../app/AppService";
import AppStore from "../../app/AppStore";
import MoodScaleView from './views/MoodScaleView';
import SleepScaleView from './views/SleepScaleView';
import BaclofenScaleView from './views/BaclofenScaleView';
import SpasticityScaleView from './views/SpasticityScaleView';
import TiredScaleView from './views/TiredScaleView';
import ExerciseReportView from './views/ExerciseReportView';
import MedicationReportView from './views/MedicationReportView';
import MemoView from './views/MemoView'
import { ScreenNames } from "../../constants/Screens";
import moment from "moment";
import {
  MeasurementTypes,
  DateFormatISO8601,
  NotExistError
} from "../../libs/scijs";
import type {
  MeasurementObject,
  MeasurementType,
  MeasurementValue
} from "../../libs/scijs"
import _ from "lodash";
import styles from "./ReportStyles"; 
import XDate from "xdate";
import { 
  RequiredCheckboxMeasurementTypesInDailyEval, 
  RequiredMeasurementTypesInDailyEval, 
  DailyEvalQuestionPriorityMap
} from "./constants";
import { IRegimen } from "../../libs/scijs/models/regimen";

const appStore = new AppStore();
const appService = new AppService();

type State = {
  measurementsByType: {
    [key: MeasurementType]: MeasurementValue
  },
  selectedDate: string,
  inSituMeasurements: MeasurementObject[],
  step: number, 
  dailyEvalReportObjId: ?string
}




export default class ReportDailyEvaluationScreen extends React.Component<any, State> {

  static navigationOptions: any = {
    title: 'Daily Evaluation'
  };

  state = {
    measurementsByType: {},
    selectedDate: this.props.navigation.getParam('selectedDate', null),
    inSituMeasurements: [],
    step: 0,
    dailyEvalReportObjId: null
  }

  dailyEvalViews = [];
  regimen: IRegimen;
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
    this.regimen = this.props.navigation.getParam('regimen', null);
    this.initializeState();
    this.getInSituMeasurements();
  }

  componentWillFocus = (payload: any) => {
    console.info("willFocus", payload);
    this.initializeState();
    this.getInSituMeasurements();
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  async initializeState() {
    try {
      let dailyEvalReportObj = await appStore.getDailyEvalByDate(this.state.selectedDate);
      this.setState({
        measurementsByType: dailyEvalReportObj.measurementsByType,
        dailyEvalReportObjId: dailyEvalReportObj.id
      }, ()=>{this._initDailyEvalViews()});
    } catch (e) {
      if(e.name === 'NotExistError'){
        this._createInitialMeasurementsByType();
        console.log('cannot find daily eval')  
      }
    }
  }

  async _createInitialMeasurementsByType(){
    try {
        let regimen = await appStore.getLatestRegimen();  
        console.log('test')

        this.setState({
          measurementsByType: {
            ...this._initMeasurementsByType(regimen.getTrackedMeasurementTypes(), 0),
            ...this._initMeasurementsByType(RequiredCheckboxMeasurementTypesInDailyEval, false),
            ...this._initMeasurementsByType(RequiredMeasurementTypesInDailyEval, '')
          }         
        }, ()=>{this._initDailyEvalViews()})    
      } catch (e) {
        console.log(e);
      }
  }

  _initMeasurementsByType = (measurementTypes: MeasurementType[], initialValue: MeasurementValue) =>{
    let initialMeasurementObj = {};
    for(let type of measurementTypes){
      initialMeasurementObj[type] = initialValue;
    }
    return initialMeasurementObj;
  }

  async getInSituMeasurements(){
    try {
      //let allMeasurements = await appStore.getMeasurementsByDate(this.state.selectedDate);
      let allMeasurements = await appStore.getMeasurementsByDate('2018-11-26');
      console.log(allMeasurements)     
      this.setState({
        inSituMeasurements: allMeasurements
      })
    } catch (e) {
        console.log(e);
    }
  }

  _initDailyEvalViews = () =>{
    let measurementTypesFromRegimen = _.keys(this.state.measurementsByType)
                                      .filter((type)=>this._isOptionalMeasurementType(type));
    measurementTypesFromRegimen = this._sortMeasurementTypesByPriority(measurementTypesFromRegimen);
    this.dailyEvalViews = [...measurementTypesFromRegimen, 
                          ...RequiredMeasurementTypesInDailyEval];

  }

  _isOptionalMeasurementType = (type:string) =>{
    return (!RequiredMeasurementTypesInDailyEval.includes(type) && 
            !RequiredCheckboxMeasurementTypesInDailyEval.includes(type)) 
  }

  _sortMeasurementTypesByPriority = (measurementTypes: MeasurementType[]) => {
    // convert to an array of object based on priority definition first
    let measurementTypesWithPriority = _.map(measurementTypes, (type: MeasurementType) => {
      return {
        type: type,
        priority: DailyEvalQuestionPriorityMap[type]  
      }
    });

    measurementTypesWithPriority = _.sortBy(measurementTypesWithPriority, 'priority');
    let sortedMeasurementTypes = _.map<any, any>(measurementTypesWithPriority, (obj: any) => {
      return obj.type
    });
    return sortedMeasurementTypes;
  }

  updateSelectedScaleValue = (type: string, value: MeasurementValue) =>{
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
  }

  _createDailyEvalReport = (meaurementsByType:{[key: MeasurementType]:MeasurementValue})=>{
    let user = appService.auth.currentUser;
    let uid = user.uid;
    let regimenId = this.regimen.id || null;
    let phase;
    if(this.regimen && this.regimen.getRegimenPhaseByDate(moment(this.state.selectedDate))) {
      let regimenPhase = this.regimen.getRegimenPhaseByDate(moment(this.state.selectedDate));
      phase = regimenPhase.phase
    }

    this.newDailyEvalReport = {
        id: this.state.dailyEvalReportObjId || appService.generatePushID(), 
        uid: uid,
        date: this.state.selectedDate, 
        createdAtTimestamp: moment().unix(),
        regimenId: regimenId, 
        regimenPhase: phase,
        measurementsByType: meaurementsByType
    }
    appStore.updateDailyEval(this.newDailyEvalReport)
  }

  _showToast = () =>{
    Toast.show({
      text: 'Daily evaluation report saved!',
      buttonText: 'OK'
    })
  }

  render(){
    let { selectedDate } = this.state;
    let markedDates = {
      [selectedDate]: {
        selected: true
      }
    }
    let measurementType = this.dailyEvalViews[this.state.step];

    return(
        <Container style={styles.container}>
          <ScrollView>
            <Content contentContainerStyle={styles.content}>
              <Card style={styles.dateCard}>
                <CardItem style = {{justifyContent:"center"}}>
                  <Title style={styles.titleText}>{this.state.selectedDate}</Title>   
                </CardItem>
              </Card>
              <DotPageIndicator 
                totalDots={this.dailyEvalViews.length}
                activeDotIndex={this.state.step}
                dotColor={'grey'}
                activeDotColor={'black'}  
              />
              {this.renderScaleView(measurementType)}
              {this.renderInSituReport(measurementType)}
              <View style={styles.nextBackBtnView}>
                <Button 
                  iconLeft 
                  bordered={true} 
                  style={styles.button} 
                  onPress={this.goToPrevious}>
                  <Icon name="arrow-back"/>
                  <AppText style={styles.textLeft}>Back</AppText>
                </Button>
                <Button 
                  iconRight 
                  style={styles.button} 
                  onPress={this.goToNext} 
                  >
                  <AppText style={styles.textRight}>{this.setNextBtnText()}</AppText>
                  <Icon name="arrow-forward"/>
                </Button>
              </View>
            </Content>
          </ScrollView>
        </Container>     
    );
  }

  goToNext = () =>{
    if (this.state.step === this.dailyEvalViews.length-1){
      this.props.navigation.navigate(ScreenNames.ReportSelection);
      this.onMeasurementValuesConfirmed();
    } else {
        this.setState({
        step: this.state.step+1
      })
    }
  }

  goToPrevious = () =>{
    if (this.state.step === 0){
      this.props.navigation.navigate(ScreenNames.ReportSelection)
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
    if(this.state.step === this.dailyEvalViews.length-1){
      return 'Done'
    } else {
      return 'Next'
    }
  }


  renderInSituReport = (measurementType:string) => {
    let inSituReport; 
    if (this._isOptionalMeasurementType(measurementType)){
      inSituReport = 
        <Card style={styles.inSituCard}>
          <CardItem header bordered>
            <Text>Your {measurementType} Records:</Text>
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
              <Right><AppText>Score {report.value}</AppText></Right>
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

  renderScaleView(measurementType:string){
    let view;
    let renderedMeasurementType = measurementType
    let selectedScaleValue;
    let selectedValueForMedication: {
      [key: MeasurementType]: MeasurementValue
    } = {}; 
    let isDailyEvalView = true;
    
    selectedScaleValue = this.state.measurementsByType[measurementType]

    RequiredCheckboxMeasurementTypesInDailyEval.forEach((type:string)=>{
      selectedValueForMedication[type] = this.state.measurementsByType[type]
    })
  
    switch(renderedMeasurementType) {
        case MeasurementTypes.sleepQuality: 
          view = <SleepScaleView
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />;
          break;
        case MeasurementTypes.spasticitySeverity: 
          view = <SpasticityScaleView
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        case MeasurementTypes.baclofenAmount:
          view = <BaclofenScaleView
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        case MeasurementTypes.tiredness:
          view = <TiredScaleView
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        case MeasurementTypes.mood:
          view = <MoodScaleView
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        case MeasurementTypes.exerciseTime:
          view = <ExerciseReportView 
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />
          break;
        case MeasurementTypes.medication:
          view = <MedicationReportView 
            selectedValue = {selectedValueForMedication}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />
          break;
        case MeasurementTypes.memo:
          view = <MemoView 
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />
          break;
        default: 
          view = <SleepScaleView
            type = {measurementType}
            selectedScaleValue = {selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />;
          break;
      }
      return(
           <Card style={styles.dailyEvalCard}>
            <CardItem style = {styles.cardItems}> 
            {view}
            </CardItem>
          </Card>
      );
  }

}