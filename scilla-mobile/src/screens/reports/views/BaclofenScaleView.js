// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title, ScaleSlider } from "../../../components";
import styles from "../ReportStyles"; 
import { BaclofenScales } from "../../../libs/intecojs";
import _ from "lodash";
import type { MeasurementValue } from "../../../libs/intecojs";
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
              maxValue = {10}
              minText = {'No at all'}
              maxText = {'Highest Balcofen Amount'}
              ></ScaleSlider>
        </View>
      );
    }
  }