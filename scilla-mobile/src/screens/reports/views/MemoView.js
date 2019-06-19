// @flow
import React from 'react';
import { View, Textarea } from "native-base";
import { AppText } from "../../../components";
import styles from "../ReportStyles"; 
import type { MeasurementValue } from "../../../libs/scijs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, value:string) =>void,
} 

export default class MemoView extends React.Component<Props,any> {
  render(){
    return(
      <View style={styles.mainView}>
        <AppText style={styles.headlineText}>Additional notes of the day</AppText>
        <Textarea 
            rowSpan={6} 
            bordered 
            placeholder="Memo"
            value = {this.props.selectedScaleValue} 
            onChangeText={value=>this.props.updateSelectedScaleValue(this.props.type, value)}
            style={styles.memoTextArea} 
        />
      </View>
    );
  }
}