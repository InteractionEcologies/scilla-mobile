// @flow
import React from "react";
import { Content, Text, View, Icon, Button} from "native-base";
import { AppText, Title } from "../../components";
import MoodScaleView from './views/MoodScaleView';
import SleepScaleView from './views/SleepScaleView';
import BaclofenScaleView from './views/BaclofenScaleView';
import SpasticityScaleView from './views/SpasticityScaleView';
import TiredScaleView from './views/TiredScaleView';
import moment from "moment";
import { MeasurementTypes, DateFormatISO8601, DateFormatTimeOfDay } from "../../libs/intecojs"; 
import type { 
  MeasurementType,
  MeasurementObject
} from "../../libs/intecojs";
import appService from "../../app/AppService";
import styles from "./ReportStyles"; 
import { ScreenNames } from "../../constants/Screens";
import AppState from "../../app/AppState";


export default class ReportMeasurmentScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: 'Report'
  };

  
  selectedMeasurementType : MeasurementType = this.props.navigation.getParam('trackedMeasurementType', null);

  state = {
      trackedMeasurementType: this.selectedMeasurementType,
      selectedScaleValue: null,
  }

  newReport: ?MeasurementObject = null

  onMeasurementValueConfirmed = () => {
    console.log("save measurement object");
    if(this.state.trackedMeasurementType && this.state.selectedScaleValue){
      this._createMeasurementReport(this.state.trackedMeasurementType, this.state.selectedScaleValue);
    };
    this.newReport = null;
    this._goToReportSelectionScreen();
  }

  _createMeasurementReport = (type: MeasurementType, value: string) =>{
    let user = appService.auth.currentUser;
    let uid = user.uid;
    this.newReport = {
        id: appService.generatePushID(),
        type: type,
        timestamp: moment().unix(),
        uid: uid,
        value: value
    }
    appService.ds.upsertMeasurement(this.newReport);
    // AppState.insertMeasurement(this.newReport);
  }

  _goToReportSelectionScreen = () =>{
    this.props.navigation.navigate(ScreenNames.ReportSelection)
  }

  updateSelectedScaleValue = (value: string) =>{
    this.setState(
      {
        selectedScaleValue: value
      }
    )
  }


  render(){
    let isBtnDisabled:boolean = !(this.state.selectedScaleValue);

    return(
      <Content contentContainerStyle={styles.content}>
        {this.renderScale()}
        <View style={styles.okBtnView}>
          <Button
            style={styles.button}
            block
            onPress={()=>this.onMeasurementValueConfirmed()} 
            disabled={isBtnDisabled}
          >
            <AppText>OK</AppText>
          </Button>
        </View>
      </Content>
    );
  }

  renderScale() {
      let view;
      switch(this.state.trackedMeasurementType) {
        case MeasurementTypes.sleepQuality: 
          view = <SleepScaleView
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />;
          break;
        case MeasurementTypes.spasticitySeverity: 
          view = <SpasticityScaleView
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />
          break;
        case MeasurementTypes.baclofenAmount:
          view = <BaclofenScaleView
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />
          break;
        case MeasurementTypes.tiredness:
          view = <TiredScaleView
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />
          break;
        case MeasurementTypes.mood:
          view = <MoodScaleView
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />
          break;
        default: 
          view = <SleepScaleView
            selectedScaleValue = {this.state.selectedScaleValue}
            updateSelectedScaleValue = {this.updateSelectedScaleValue}
          />;
          break;
      }
      return view;
    }

}