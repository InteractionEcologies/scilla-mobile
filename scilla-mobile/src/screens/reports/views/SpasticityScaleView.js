// @flow
import React from 'react';
import { View } from "native-base";
// import { StyleSheet, Slider } from "react-native";
import { AppText, ScaleSlider } from "../../../components";
import styles from "../ReportStyles"; 
import type { MeasurementValue } from "../../../libs/scijs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, scaleValue:number) =>void,
  isDailyEvalView: bool
} 

export default class SpasticityScaleView extends React.Component<Props, any> {

    render() {
      let headlineText = this.props.isDailyEvalView? 
                          "Rate today's overall spasticity"
                          : "How severe is your spasticity now?"; 
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
              minText = {'No Spasticity pain'}
              maxText = {'Worst possible spasticity pain'}
              ></ScaleSlider>
        </View>
      );
    }
  }
