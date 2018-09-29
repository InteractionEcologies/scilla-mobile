// @flow
import React from "react";
import { createStackNavigator } from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";
import { Platform } from "react-native";
import { Root } from "native-base";
import ReportSelectionScreen from "../screens/reports/ReportSelectionScreen";
import ReportMeasurementScreen from "../screens/reports/ReportMeasurementScreen";
import ReportDailyEvaluationScreen from "../screens/reports/ReportDailyEvaluationScreen";
import { ScreenNames } from "../constants/Screens";

let ReportStack = createStackNavigator(
  {
    [ScreenNames.ReportSelection]: ReportSelectionScreen,
    [ScreenNames.ReportMeasurement]: ReportMeasurementScreen,
    [ScreenNames.ReportDailyEvaluation]: ReportDailyEvaluationScreen
  },
  {
    initialRouteName: ScreenNames.ReportSelection
  }

)

ReportStack.navigationOptions = {
  tabBarLabel: "Report",
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
