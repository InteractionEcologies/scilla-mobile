// @flow
import React from "react";
import { StyleSheet } from 'react-native';
import { Content, View } from "native-base";
import { AppText } from "../../components";

export default class ReportSelectionScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: "Select Measurement"
  }
  
  render() {
    return (
      <Content contentContainerStyle={styles.mainView}>
        <AppText>Report</AppText>
      </Content>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 0.8, 
    justifyContent: 'center',
    alignItems: 'center'
  }
})