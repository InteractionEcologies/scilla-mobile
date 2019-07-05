// @flow
import React from 'react';
import { View, Textarea } from "native-base";
import { StyleSheet } from "react-native";
import { AppText } from "../../../components";
// import styles from "../ReportStyles"; 
import type { MeasurementValue } from "../../../libs/scijs";

type Props = {
  type: string,
  selectedScaleValue: MeasurementValue,
  updateSelectedScaleValue: (type: string, value:string) =>void,
} 

export default class MemoView extends React.Component<Props,any> {
  render(){
    return(
      <View style={styles.main}>
        <AppText style={styles.title}>Memo</AppText>
        <Textarea 
            rowSpan={6} 
            bordered 
            placeholder=""
            value = {this.props.selectedScaleValue} 
            onChangeText={value=>this.props.updateSelectedScaleValue(this.props.type, value)}
            style={styles.textarea} 
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {

  },
  textarea: {
    width: '100%'
  }
})