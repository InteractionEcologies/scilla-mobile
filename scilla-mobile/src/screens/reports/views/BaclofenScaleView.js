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

export default class BaclofenScaleView extends React.Component<Props, any> {
  
    render() {
      let headlineText = this.props.isDailyEvalView? 
                          "Rate today's overall balcofen amount"
                          : "How much Balcofen amount do you take now?"; 
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
              minText = {'No at all'}
              maxText = {'Highest Balcofen Amount'}
              ></ScaleSlider>
        </View>
      );
    }
  }