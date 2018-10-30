// @flow
import React from 'react';
import { Text, View, Button, Icon, Textarea, Form } from "native-base";
import { AppText, Title } from "../../../components";
import styles from "../ReportStyles"; 
import type { MeasurementValue } from "../../../libs/intecojs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, value:string) =>void,
} 

export default class MemoView extends React.Component<Props,any> {
  render(){
    return(
      <View style={styles.mainView}>
        <AppText style={styles.headlineText}>Leave a memo for additional info</AppText>
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