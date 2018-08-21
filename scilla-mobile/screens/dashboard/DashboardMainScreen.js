// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Content } from "native-base"; 
import { AppText } from "../../components";

export default class DashboardMainScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: "Today"
  }
  
  render() {
    return (
      <Content contentContainerStyle={styles.mainView}>
        <AppText>Today</AppText>
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