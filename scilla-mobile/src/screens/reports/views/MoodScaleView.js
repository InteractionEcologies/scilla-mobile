// @flow
import React from 'react';
import { View } from "native-base";
import { AppText, ScaleSlider } from "../../../components";
import styles from "../ReportStyles"; 
import type { MeasurementValue } from "../../../libs/scijs";

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
              selectedScaleValueText = {null}
              updateSelectedScaleValue = {this.props.updateSelectedScaleValue}
              minValue = {0}
              maxValue = {5}
              minText = {'Depressed'}
              maxText = {'Manic'}
              ></ScaleSlider>
        </View>
      );
    }

    // renderScaleValueText(){
    //   return this.props.selectedScaleValue === 0 ? 'Normal' : null
    // }
  }