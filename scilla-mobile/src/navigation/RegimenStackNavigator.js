// @flow
import React from "react";
import { Platform } from 'react-native';
import { createStackNavigator } from "react-navigation";
import TabBarIcon from '../components/TabBarIcon';

import RegimenMainScreen from "../screens/regimens/RegimenMainScreen";
import RegimenCreationScreens from "../screens/regimens/RegimenCreationScreens";
import RegimenRedeemScreen from "../screens/regimens/RegimenRedeemScreen";
import RegimenEditScreen from "../screens/regimens/RegimenEditScreen";
import RegimenEditReminderScreen from "../screens/regimens/RegimenEditReminderScreen";

import {ScreenNames} from "../constants/Screens";

// let routeConfigs = {};
// routeConfigs[ScreenNames.RegimenMain] = RegimenMainScreen;
// routeConfigs[ScreenNames.RegimenCreate] = RegimenCreateScreen;

let RegimenStack = createStackNavigator(
  {
    [ScreenNames.RegimenMain]: RegimenMainScreen, 
    [ScreenNames.RegimenCreation]: RegimenCreationScreens,
    [ScreenNames.RegimenRedeem]: RegimenRedeemScreen,
    [ScreenNames.RegimenEdit]: RegimenEditScreen, 
    [ScreenNames.RegimenEditReminders]: RegimenEditReminderScreen
  },
  {
    initialRouteName: ScreenNames.RegimenMain
  }
)

RegimenStack.navigationOptions = {
  tabBarLabel: 'Regimen',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-medkit`
          : 'md-medkit'              
      }
    />
  )
}

export default RegimenStack;