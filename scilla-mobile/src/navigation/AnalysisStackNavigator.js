// @flow
import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import TabBarIcon from "../components/TabBarIcon";
import { Platform } from "react-native";

import AnalysisMainScreen from "../screens/analysis/AnalysisMainScreen";
import { ScreenNames } from "../constants/Screens";

let AnalysisStack = createStackNavigator(
  {
    [ScreenNames.AnalysisMain]: AnalysisMainScreen
  }
)

AnalysisStack.navigationOptions = {
  tabBarLabel: "Trend",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon 
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-stats`
          : 'md-stats'
      }
    />
  )
}

export default AnalysisStack