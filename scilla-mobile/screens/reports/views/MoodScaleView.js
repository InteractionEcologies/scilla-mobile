// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title, ScaleSlider } from "../../../components";
import styles from "../ReportStyles"; 
import { MoodScales }  from "../../../libs/intecojs"; 
import _ from "lodash";
import type { MeasurementValue } from "../../../libs/intecojs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, scaleValue:number) =>void,
  isDailyEvalView: bool
} 

export default class MoodScaleView extends React.Component<Props, any> {
  
    render() {
      let headlineText = this.props.isDailyEvalView? 
                          "Rate today's overall mood" 
                          : "How do you feel now?"; 
      return (
        <View style={styles.mainView}>
            <AppText style={styles.headlineText}>{headlineText}</AppText> 
            <ScaleSlider 
              type = {this.props.type}
              selectedScaleValue = {this.props.selectedScaleValue}
              selectedScaleValueText = {this.renderScaleValueText()}
              updateSelectedScaleValue = {this.props.updateSelectedScaleValue}
              minValue = {-3}
              maxValue = {3}
              minText = {'Depressed'}
              maxText = {'Manic'}
              ></ScaleSlider>
        </View>
      );
    }

    renderScaleValueText(){
      return this.props.selectedScaleValue === 0 ? 'Normal' : null
    }
  }