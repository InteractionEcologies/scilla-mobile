// @flow
import React from "react";
import { Container, Content, View, Button, Toast, Card, CardItem} from "native-base";
import { AppText, Title } from "../../components";
import MoodScaleView from './views/MoodScaleView';
import SleepScaleView from './views/SleepScaleView';
import BaclofenScaleView from './views/BaclofenScaleView';
import SpasticityScaleView from './views/SpasticityScaleView';
import TiredScaleView from './views/TiredScaleView';
import moment from "moment";
import { MeasurementTypes, DateFormatISO8601 } from "../../libs/scijs"; 
import type { 
  MeasurementType,
  MeasurementObject,
  MeasurementValue
} from "../../libs/scijs";
import AppService from "../../app/AppService";
import styles from "./ReportStyles"; 
import { ScreenNames } from "../../constants/Screens";
import AppStore from "../../app/AppStore";
import AppClock from "../../app/AppClock";

import XDate from "xdate";

const appStore = new AppStore();
const appService = new AppService();
const appClock = new AppClock();

type State = {
  currentDate: string, 
  trackedMeasurementType: MeasurementType,
  selectedScaleValue: MeasurementValue
}

export default class ReportMeasurmentScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: 'Report'
  };

  state = {
    currentDate: appClock.now().format(DateFormatISO8601),
    trackedMeasurementType: this.props.navigation.getParam('trackedMeasurementType', null),
    selectedScaleValue: 0,
  }

  newReport: ?MeasurementObject = null

  onMeasurementValueConfirmed = () => {
    console.log("save measurement object");
    if(this.state.trackedMeasurementType){
      this._createMeasurementReport(this.state.trackedMeasurementType, this.state.selectedScaleValue);
    };
    this.newReport = null;
    this._showToast();
    this._goToReportSelectionScreen();
  }

  _showToast = () =>{
    Toast.show({
      text: 'Report saved!',
      buttonText: 'Okay'
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
  }

  _goToReportSelectionScreen = () =>{
    this.props.navigation.navigate(ScreenNames.ReportSelection)
  }

  updateSelectedScaleValue = (type:string, value:number) =>{
    this.setState(
      {
        selectedScaleValue: value
      }
    )
  }

  onDayPressed = (day: XDate) => {
    this.setState({
      currentDate: day.dateString
    })
  }


  render(){
    let { currentDate } = this.state;
    // let markedDates = {
    //   [currentDate]: {
    //     selected: true
    //   }
    // }

    return(
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.content}>
        <Card style={styles.selectionCard}>
          <CardItem style = {styles.cardDate} bordered>
            <Title style={styles.titleText}>{currentDate}</Title>   
          </CardItem>
          <CardItem style = {styles.cardItems}>
          {this.renderScale()}
          </CardItem>
        </Card>
          <View style={styles.okBtnView}>
            <Button
              style={styles.button}
              block
              onPress={()=>this.onMeasurementValueConfirmed()} 
            >
              <AppText>OK</AppText>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }

  renderScale() {
      let view;
      let isDailyEvalView = false;
      switch(this.state.trackedMeasurementType) {
        case MeasurementTypes.sleepQuality: 
          view = <SleepScaleView
            type = {this.state.trackedMeasurementType}
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />;
          break;
        case MeasurementTypes.spasticitySeverity: 
          view = <SpasticityScaleView
            type = {this.state.trackedMeasurementType}
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        case MeasurementTypes.baclofenAmount:
          view = <BaclofenScaleView
            type = {this.state.trackedMeasurementType}
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        case MeasurementTypes.tiredness:
          view = <TiredScaleView
            type = {this.state.trackedMeasurementType}
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        case MeasurementTypes.mood:
          view = <MoodScaleView
            type = {this.state.trackedMeasurementType}
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />
          break;
        default: 
          view = <SleepScaleView
            type = {this.state.trackedMeasurementType}
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
            isDailyEvalView = {isDailyEvalView}
          />;
          break;
      }
      return view;
    }

}