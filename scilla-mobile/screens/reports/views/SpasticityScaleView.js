// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
// import { StyleSheet, Slider } from "react-native";
import { AppText, Title, ScaleSlider } from "../../../components";
import styles from "../ReportStyles"; 
import { SpasticityScales }  from "../../../libs/intecojs"; 
import _ from "lodash";
import type { MeasurementValue } from "../../../libs/intecojs";

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
              maxValue = {10}
              minText = {'No Spasticity'}
              maxText = {'Worst possible Spasticity'}
              ></ScaleSlider>
        </View>
      );
    }
  }

