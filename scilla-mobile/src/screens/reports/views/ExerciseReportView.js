// @flow
import React from 'react';
import { View, Item, Input } from "native-base";
import { AppText } from "../../../components";
import styles from "../ReportStyles"; 
import type { MeasurementValue } from "../../../libs/scijs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, scaleValue:string) =>void,
} 

export default class ExerciseReportView extends React.Component<Props,any> {
  render(){
    return(
      <View style={styles.mainView}>
        <AppText style={styles.headlineText}>How long did you exercise/stretch?</AppText>
          <View style={styles.exerciseView}>
            <Item style={styles.exerciseItem}>
              <Input 
                  style={styles.exerciseInput}
                  value={this.props.selectedScaleValue}
                  onChangeText={value=>this.props.updateSelectedScaleValue(this.props.type, value) }
              />
            </Item>
            <AppText>min</AppText>
          </View>
      </View>
    );
  }
}
