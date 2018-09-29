// @flow
import React from "react";
import { Text, View, Button, Icon } from "native-base";
import { StyleSheet, Slider } from "react-native";
import { AppText } from "./index";
import type { MeasurementValue } from "../libs/intecojs";

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
    return(
      <View style={styles.container}>
        <View style={styles.scaleText}>
          <AppText style={styles.scaleValue}>{this.props.selectedScaleValue}</AppText>
          <AppText style={styles.scaleValueText}>{this.props.selectedScaleValueText}</AppText>
        </View>
        <Slider
          style={styles.slider}
          disabled={false}
          step={1}
          minimumValue={this.props.minValue}
          maximumValue={this.props.maxValue}
          value={this.props.selectedScaleValue}
          onValueChange={value=>this.props.updateSelectedScaleValue(this.props.type, value) }
        ></Slider>
        <View style={styles.sliderScaleValue}>         
          <AppText style={styles.sliderTextNum}>{this.props.minValue}</AppText>
          <AppText style={styles.sliderTextNum}>{this.props.maxValue}</AppText>
        </View>
        <View style={styles.sliderScaleText}>              
          <AppText style={styles.sliderText}>{this.props.minText}</AppText>
          <AppText style={styles.sliderText}>{this.props.maxText}</AppText>
        </View>
      </View>
      
    );

  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: 270
  },
  scaleText:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    marginBottom:20
  },
  scaleValue:{
    fontSize: 40,
    marginBottom: 10
  },
  sliderScaleValue: {
    width: 330,
    flexDirection: "row", 
    justifyContent: 'space-between',
    left: 0, 
    right: 0, 
  },
  sliderScaleText: {
    width: 330,
    flexDirection: "row", 
    justifyContent: 'space-between',
    left: 0, 
    right: 0, 
    marginBottom: 10
  },
  sliderTextNum: {
    width:70,
    fontSize: 16,
    textAlign: "center"
  },
  sliderText: {
    width:70,
    fontSize: 12,
    textAlign: "center"
  }
})