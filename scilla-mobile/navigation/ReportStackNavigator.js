// @flow
import React from "react";
import { createStackNavigator } from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";
import { Platform } from "react-native";

import ReportSelectionScreen from "../screens/reports/ReportSelectionScreen";
import { ScreenNames } from "../constants/Screens";

let ReportStack = createStackNavigator(
  {
    [ScreenNames.ReportSelection]: ReportSelectionScreen
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