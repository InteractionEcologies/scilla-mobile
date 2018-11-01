// @flow
import React from 'react';
import { Text, View, Button, Icon, Card, CardItem } from "native-base";
import { AppText, Title, ScaleSlider } from "../../../components";
import styles from "../ReportStyles"; 
import { SleepScales }  from "../../../libs/intecojs"; 
import _ from "lodash";
import type {
  MeasurementValue
} from "../../../libs/intecojs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, scaleValue:number) =>void,
  isDailyEvalView: bool
} 

export default class SleepScaleView extends React.Component<Props, any> {
    
  render() {
    let headlineText = this.props.isDailyEvalView? 
                        "Rate today's overall sleepliness" 
                        : "How do you feel sleepliness now?"; 
    let scaleValueText = this.renderScaleValueText()
    return (
      <View style={styles.mainView}>
          <AppText style={styles.headlineText}>{headlineText}</AppText> 
            <ScaleSlider 
              type = {this.props.type}
              selectedScaleValue = {this.props.selectedScaleValue}
              selectedScaleValueText = {null}
              updateSelectedScaleValue = {this.props.updateSelectedScaleValue}
              minValue = {0}
              maxValue = {5}
              minText = {'Not sleepy at all'}
              maxText = {'Very sleepy'}
              ></ScaleSlider>
      </View>
    );
  }

  renderScaleValueText(){
    let scaleValueText; 

    switch(this.props.selectedScaleValue) {
      case 0:
        scaleValueText = 'Feeling active, vital, alert, or wide awake';
        break; 
      case 1:
        scaleValueText = 'Functioning at high levels, but not at peak, able to concentrate'
        break;
      case 2:
        scaleValueText = 'Awake, but relaxed, responsive but not fully alert'
        break;
      case 3:
        scaleValueText = 'Somewhat foggy, let down'
        break;
      case 4:
        scaleValueText = 'Foggy, losing interest in remaining awake, slowed down'
        break;
      case 5:
        scaleValueText = 'Sleepy, woozy, fighting sleep, prefer to lie down'
        break;
      case 6:
        scaleValueText = 'No longer fighting sleep, sleep onset soon; having dream-like thoughts'
        break;
      default: 
        scaleValueText = 'Awake, but relaxed, responsive but not fully alert'
        break;
    }
    return scaleValueText;

  }
}