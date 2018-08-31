// @flow
import React from "react";
import { StyleSheet } from 'react-native';
import { Content, Text, View, Icon, Button} from "native-base";
import { AppText, Title } from "../../components";
import MoodScaleView from './views/MoodScaleView';
import SleepScaleView from './views/SleepScaleView';
import BaclofenScaleView from './views/BaclofenScaleView';
import SpasticityScaleView from './views/SpasticityScaleView';
import TiredScaleView from './views/TiredScaleView';
import moment from "moment";
import { MeasurementTypes } from "../../libs/intecojs"; 
// import { SleepScales, SpasticityScales, BaclofenScales, TirednessScales, MoodScales }  from "../../libs/intecojs"; 
import MeasurementOptionList from "./views/MeasurementOptionList";
import type { 
  MeasurementType,
  MeasurementObject
} from "../../libs/intecojs";
import AppService from "../../app/AppService";
const appService = new AppService();
import styles from "./ReportStyles"; 
import { ScreenNames } from "../../constants/Screens";


const InnerViewStates = {
    MeasurementOptionSelection: "measurementOptionSelection",
    Scale: "scale"
}

export default class ReportSelectionScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: 'Report'
  };

  state = {
      innerViewState: InnerViewStates.MeasurementOptionSelection,
      trackedMeasurementType: null,
      selectedScale: null,
      scale: null
  }

  newReport: ?MeasurementObject = null

  onMeasurementValueConfirmed = () => {
    console.log("save measurement object");

    let user = appService.auth.currentUser;
    let uid = user.uid;

    if (this.state.trackedMeasurementType && 
      this.state.selectedScale
    ) {
      let trackedMeasurementType: MeasurementType = this.state.trackedMeasurementType;
      let selectedScale: string = this.state.selectedScale; 

      let report = {
          id: appService.generatePushID(),
          timestamp: moment().unix(),
          type: trackedMeasurementType,
          uid: uid,
          value: selectedScale
      }
      appService.ds.upsertMeasurement(report);  
    }
    this.goToReportSelectionScreen();
  }

  updateTrackedMeasurementType = (measurementType: string) => {
     this.setState(
       { 
         trackedMeasurementType: measurementType
        }
      )
  }

  updateSelectedScale = (scaleValue: string) =>{

    this.setState(
      {
        selectedScale: scaleValue
      }
    )
  }

  goToScaleView = () =>{
    this.setState({
      innerViewState: InnerViewStates.Scale
    })
  }

  goToMeasurementTypeOptionView = () =>{
    this.setState({
      innerViewState: InnerViewStates.MeasurementOptionSelection,
      selectedScale: null
    })
  }

  goToReportSelectionScreen = () =>{
    this.props.navigation.navigate(ScreenNames.ReportSelection)
  }

  render(){
      return(
          <Content contentContainerStyle={styles.content}>
            <Title style={styles.titleText}>Report your experience</Title>
              {this.renderInnerView()}
            
          </Content>
      );
    }

    renderInnerView() {
      if(this.state.innerViewState === InnerViewStates.MeasurementOptionSelection) {
        return this._renderMeasurementOptionList();
      } else {
        return this._renderScale();
      }
    }

    _renderMeasurementOptionList() {

      return (
        <MeasurementOptionList 
          updateTrackedMeasurementType={this.updateTrackedMeasurementType}
          trackedMeasurementType = {this.state.trackedMeasurementType}
          goToScaleView = {this.goToScaleView}
          goToReportSelectionScreen = {this.goToReportSelectionScreen}
        />
      )
    }

    _renderScale() {
      let view;
      switch(this.state.trackedMeasurementType) {
        case MeasurementTypes.sleepQuality: 
          view = <SleepScaleView
            selectedScale = {this.state.selectedScale}
            updateSelectedScale = {this.updateSelectedScale}
            onValueConfirmed={this.onMeasurementValueConfirmed}
            goToMeasurementTypeOptionView = {this.goToMeasurementTypeOptionView}
          />;
          break;
        case MeasurementTypes.spasticitySeverity: 
          view = <SpasticityScaleView
            selectedScale = {this.state.selectedScale}
            updateSelectedScale = {this.updateSelectedScale}
            onValueConfirmed={this.onMeasurementValueConfirmed}
            goToMeasurementTypeOptionView = {this.goToMeasurementTypeOptionView}
          />
          break;
        case MeasurementTypes.baclofenAmount:
          view = <BaclofenScaleView
            selectedScale = {this.state.selectedScale}
            updateSelectedScale = {this.updateSelectedScale}
            onValueConfirmed={this.onMeasurementValueConfirmed}
            goToMeasurementTypeOptionView = {this.goToMeasurementTypeOptionView}
          />
          break;
        case MeasurementTypes.tiredness:
          view = <TiredScaleView
            selectedScale = {this.state.selectedScale}
            updateSelectedScale = {this.updateSelectedScale}
            onValueConfirmed={this.onMeasurementValueConfirmed}
            goToMeasurementTypeOptionView = {this.goToMeasurementTypeOptionView}
          />
          break;
        case MeasurementTypes.mood:
          view = <MoodScaleView
            selectedScale = {this.state.selectedScale}
            updateSelectedScale = {this.updateSelectedScale}
            onValueConfirmed={this.onMeasurementValueConfirmed}
            goToMeasurementTypeOptionView = {this.goToMeasurementTypeOptionView}
          />
          break;
        default: 
          view = <SleepScaleView
            selectedScale = {this.state.selectedScale}
            updateSelectedScale = {this.updateSelectedScale}
            onValueConfirmed={this.onMeasurementValueConfirmed}
            goToMeasurementTypeOptionView = {this.goToMeasurementTypeOptionView}
          />;
          break;
      }
      return view;
    }
}





  