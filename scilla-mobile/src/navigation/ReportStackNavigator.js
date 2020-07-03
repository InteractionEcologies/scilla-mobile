// @flow
import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import TabBarIcon from "../components/TabBarIcon";
import { Platform } from "react-native";
import ReportMainScreen from "../screens/reports/ReportMainScreen";
// import ReportSelectionScreen from "../screens/reports/ReportSelectionScreen";
import ReportMeasurementScreen from "../screens/reports/ReportMeasurementScreen";
import ReportDailyEvaluationScreen from "../screens/reports/ReportDailyEvaluationScreen";
import { ScreenNames } from "../constants/Screens";

let ReportStack = createStackNavigator(
  {
    [ScreenNames.ReportMain]: ReportMainScreen,
    // [ScreenNames.ReportSelection]: ReportSelectionScreen,
    [ScreenNames.ReportMeasurement]: ReportMeasurementScreen,
    [ScreenNames.ReportDailyEvaluation]: ReportDailyEvaluationScreen
  },
  {
    initialRouteName: ScreenNames.ReportMain
  }

)

ReportStack.navigationOptions = {
  tabBarLabel: "Daily Report",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon 
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-add-circle${focused ? '': '-outline'}`
          : 'md-add-circle'
      }
    />
  )
}

export default ReportStack
