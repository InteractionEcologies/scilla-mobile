// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title, ScaleSlider } from "../../../components";
import styles from "../ReportStyles"; 
import { TirednessScales }  from "../../../libs/intecojs"; 
import _ from "lodash";
import type { MeasurementValue } from "../../../libs/intecojs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, scaleValue:number) =>void,
  isDailyEvalView: bool
} 

export default class TiredScaleView extends React.Component<Props, any> {
  
    render() {
      let headlineText = this.props.isDailyEvalView? 
                          "Rate today's overall tiredness"
                          : "How do you feel tiredness now?"; 
      return (
        <View style={styles.mainView}>
            <AppText style={styles.headlineText}>{headlineText}</AppText> 
            <ScaleSlider 
              type = {this.props.type}
              selectedScaleValue = {this.props.selectedScaleValue}
              selectedScaleValueText = {null}
              updateSelectedScaleValue = {this.props.updateSelectedScaleValue}
              minValue = {0}
              maxValue = {10}
              minText = {'No tiredness'}
              maxText = {'Worst possible tiredness'}
              ></ScaleSlider>
        </View>
      );
  }
}