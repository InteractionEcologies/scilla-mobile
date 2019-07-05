// @flow
import React, { Component } from 'react';
import { StyleSheet } from "react-native"
import { View } from "native-base";
import { AppText, ScaleSlider, Title } from "../../../components";
import type { MeasurementValue, MeasurementType } from "../../../libs/scijs";

type Props = {
  title: string,
  type: MeasurementType,
  minValue: number, 
  maxValue: number,
  minValueDesc: string, 
  maxValueDesc: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: MeasurementType, scaleValue: MeasurementValue) => void,

  isDailyEval: boolean
}

export default class GenericScaleView extends Component<Props, any> {

    render() {
      const { title, type, minValue, maxValue, 
        minValueDesc, maxValueDesc,
        selectedScaleValue 
      } = this.props;
      const { updateSelectedScaleValue } = this.props;

      return (
        <View style={styles.main}>
          <Title style={styles.title}>{title}</Title> 
          <ScaleSlider 
            type = {type}
            selectedScaleValue = {selectedScaleValue}
            selectedScaleValueText = {null}
            updateSelectedScaleValue = {updateSelectedScaleValue}
            minValue = {minValue}
            maxValue = {maxValue}
            minText = {minValueDesc}
            maxText = {maxValueDesc}
            ></ScaleSlider>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    // backgroundColor: 'green'
  },
  title: {
    marginBottom: 10
  }
    
});