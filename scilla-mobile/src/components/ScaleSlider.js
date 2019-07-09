// @flow
import React from "react";
import { View } from "native-base";
import { StyleSheet, Slider } from "react-native";
import { AppText } from "./StyledText";
import type { MeasurementValue } from "../libs/scijs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  selectedScaleValueText:? string,
  updateSelectedScaleValue: (type: string, scaleValue:number) =>void,
  minValue: number,
  maxValue: number,
  minText: string,
  maxText: string
}

export class ScaleSlider extends React.Component<Props, any> {

  render(){
    const { 
      type, selectedScaleValue, selectedScaleValueText,
      minValue, maxValue, minText, maxText
    } = this.props
    return(
      <View style={styles.main}>
        <View style={styles.scaleTextView}>
          <AppText style={styles.scaleValue}>{selectedScaleValue}</AppText>
          {!!selectedScaleValueText &&
            <AppText style={styles.scaleValueText}>{selectedScaleValueText}</AppText>
          }
        </View>
        <Slider
          style={styles.slider}
          disabled={false}
          step={1}
          minimumValue={minValue}
          maximumValue={maxValue}
          value={selectedScaleValue}
          onValueChange={value=>this.props.updateSelectedScaleValue(type, value) }
        ></Slider>
        <View style={styles.sliderScaleValueView}>         
          <AppText style={[styles.sliderValue, {textAlign: 'left' }]}>{minValue}</AppText>
          <AppText style={[styles.sliderValue, {textAlign: 'right'}]}>{maxValue}</AppText>
        </View>
        <View style={styles.sliderScaleTextView}>              
          <AppText style={[styles.sliderText, {textAlign: 'left'}]}>{minText}</AppText>
          <AppText style={[styles.sliderText, {textAlign: 'right'}]}>{maxText}</AppText>
        </View>
      </View>
      
    );

  }
}

const styles = StyleSheet.create({
  main:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: '90%'
  },
  scaleTitleView:{
    justifyContent: 'center',
    alignItems: 'center',
    // height: 30,
    // height: 100,
    // marginBottom: 20,
    // backgroundColor: 'red'
  },
  scaleValue:{
    fontSize: 40,
    // backgroundColor: 'yellow'
  },
  scaleValueText: {
    fontSize: 12,
  },
  sliderScaleValueView: {
    width: '90%',
    // height: 30,
    flexDirection: "row", 
    justifyContent: 'space-between'
  },
  sliderScaleTextView: {
    width: '90%',
    // height: 30,
    flexDirection: "row", 
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sliderValue: {
    width:70,
    fontSize: 20,
    textAlign: "center"
  },
  sliderText: {
    flex: 1,
    // width:70,
    fontSize: 16,
    textAlign: "center"
  }
})