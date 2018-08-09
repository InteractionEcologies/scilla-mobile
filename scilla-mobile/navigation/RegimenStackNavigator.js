// @flow
import React from "react";
import { Platform } from 'react-native';
import { createStackNavigator } from "react-navigation";
import TabBarIcon from '../components/TabBarIcon';

import RegimenMainScreen from "../screens/regimens/RegimenMainScreen";
import RegimenTypeSelectionScreen from "../screens/regimens/RegimenTypeSelectionScreen";
import RegimenTypeOverviewScreen from "../screens/regimens/RegimenTypeOverviewScreen";
import RegimenVarSelectionScreen from "../screens/regimens/RegimenVarSelectionScreen";
import {ScreenNames} from "../constants/Screens";

// let routeConfigs = {};
// routeConfigs[ScreenNames.RegimenMain] = RegimenMainScreen;
// routeConfigs[ScreenNames.RegimenCreate] = RegimenCreateScreen;

let RegimenStack = createStackNavigator(
  {
    RegimenMain: RegimenMainScreen, 
    RegimenTypeSelection: RegimenTypeSelectionScreen,
    RegimenTypeOverview: RegimenTypeOverviewScreen,
    RegimenVarSelection: RegimenVarSelectionScreen,
  },
  {
    initialRouteName: ScreenNames.RegimenMain
  }
)

RegimenStack.navigationOptions = {
  tabBarLabel: 'Regimens',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-flask${focused ? '' : '-outline'}`
          : 'md-flask'              
      }
    />
  )
}

export default RegimenStack;