// @flow
import React from "react";
import { StyleSheet } from "react-native";
import { Content, Button, Toast, Card, CardItem} from "native-base";
import { AppText, Title } from "../../components";
import GenericScaleView from "./views/GenericScaleView";
import { MeasurementTypes } from "../../libs/scijs"; 
import type { 
  MeasurementType,
  MeasurementObject,
  MeasurementValue
} from "../../libs/scijs";
import AppService from "../../services/AppService";
import AppStore from "../../services/AppStore";
import AppClock from "../../services/AppClock";
import UsageLogger, { UsageEvents } from "../../services/UsageLogger";

import MemoView from "./views/MemoView";

const appStore = AppStore.instance;
const appService = AppService.instance;
const appClock = AppClock.instance;
const logger = UsageLogger.instance;

type State = {
  // currentDate: string, 
  trackedMeasurementType: MeasurementType,
  selectedScaleValue: MeasurementValue
}

export default class ReportMeasurmentScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: 'Memo'
  };

  state = {
    // currentDate: appClock.now().format(DateFormatISO8601),
    trackedMeasurementType: this.props.navigation.getParam('trackedMeasurementType', null),
    selectedScaleValue: 0,
  }

  newReport: ?MeasurementObject = null

  onMeasurementValueConfirmed = () => {
    if(this.state.trackedMeasurementType){
      this._createMeasurementReport(this.state.trackedMeasurementType, this.state.selectedScaleValue);
    };
    this.newReport = null;
    this._showToast();
    this._goToReportSelectionScreen();
  }

  _showToast = () =>{
    Toast.show({
      text: 'Report saved.',
      buttonText: 'OK'
    })
  }

  _createMeasurementReport = (type: MeasurementType, value: MeasurementValue) =>{
    let user = appService.auth.currentUser;
    let uid = user.uid;

    this.newReport = {
        id: appService.generatePushID(),
        type: type,
        timestamp: appClock.now().unix(),
        uid: uid,
        value: value
    }
    appStore.insertMeasurement(this.newReport);
    logger.logEvent(UsageEvents.report_mem);
  }

  _goToReportSelectionScreen = () =>{
    // this.props.navigation.navigate(ScreenNames.ReportSelection)
    this.props.navigation.popToTop();
  }

  updateSelectedScaleValue = (type: MeasurementType, value: MeasurementValue) =>{
    this.setState(
      {
        selectedScaleValue: value
      }
    )
  }

  // onDayPressed = (day: XDate) => {
  //   this.setState({
  //     currentDate: day.dateString
  //   })
  // }


  render(){
    // let { currentDate } = this.state;
    // let markedDates = {
    //   [currentDate]: {
    //     selected: true
    //   }
    // }
    const dateStr = appClock.now().format("h:mm a")

    return(
      // <Container style={styles.container}>
        <Content contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <CardItem style = {styles.cardItem} bordered>
              <Title style={styles.title}>{dateStr}</Title>   
            </CardItem>
            <CardItem style = {styles.cardItem}>
              {this.renderScale()}
            </CardItem>
            <CardItem style = {styles.cardItem}>
              <Button
                style={styles.button}
                full
                onPress={()=>this.onMeasurementValueConfirmed()} 
              >
                <AppText>OK</AppText>
              </Button>
            </CardItem>
          </Card>
        </Content>
      // </Container>
    );
  }

  renderScale() {
      const { 
        trackedMeasurementType, 
        selectedScaleValue, 
      } = this.state;
      let view;
      // let isDailyEvalView = false;
      let minValueDesc = "Best possible";
      let maxValueDesc = "Worst possible";
      let useGenericView = true;

      switch(this.state.trackedMeasurementType) {
        case MeasurementTypes.muscleTightness:
          minValueDesc = "No muscle tightness";
          maxValueDesc = "Worst possible tightness";
          break;
        case MeasurementTypes.sleepQuality: 
          minValueDesc="Best possible sleep quality";
          maxValueDesc="Worst possible sleep quality";
          break;
        case MeasurementTypes.spasticitySeverity: 
          minValueDesc = "No pain";
          maxValueDesc = "Worst possible pain";
          break;
        case MeasurementTypes.tiredness:
          minValueDesc = "Very energetic";
          maxValueDesc = "Worst possible tiredness";
          break;
        case MeasurementTypes.weakness:
          minValueDesc = "No feeling of weakness";
          maxValueDesc = "Worst possible weakness";
          break;
        case MeasurementTypes.sleepiness:
          minValueDesc = "No feeling of sleepiness";
          maxValueDesc = "Very sleepy";
          break;
        case MeasurementTypes.dizziness:
          minValueDesc = "No feeling of dizziness";
          maxValueDesc = "Worst possible dizziness";
          break;
        case MeasurementTypes.respiratoryMovement:
          minValueDesc = "No respiratory problem";
          maxValueDesc = "Worst possible respiratory problem";
          break;
        case MeasurementTypes.memo:
          view = <MemoView 
            type={trackedMeasurementType}
            selectedScaleValue={selectedScaleValue}
            updateSelectedScaleValue={this.updateSelectedScaleValue}
          />
          useGenericView = false;
          break;
        case MeasurementTypes.mood:
          minValueDesc = "Very good mood";
          maxValueDesc = "Very bad mood";
          break;
        default: 
          break;
      }

      if(useGenericView) {
        view = <GenericScaleView
        type={trackedMeasurementType}
        title={trackedMeasurementType}
        minValue={0}
        maxValue={5}
        minValueDesc={minValueDesc}
        maxValueDesc={maxValueDesc}
        selectedScaleValue={selectedScaleValue}
        updateSelectedScaleValue={this.updateSelectedScaleValue}
        isDailyEval={false}
      />
      }
      
      return view;
    }

}

const styles = StyleSheet.create({
  content: {
    flex: 1, 
    width: '100%',
    paddingLeft: 10, 
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  card: {
    // flex: 1,
    width: '100%'

  }, 
  cardItem: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    flex: 1
  }, 
  button: {
    flex: 1
  }

})