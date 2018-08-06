// @flow
import React from "react";
import { Platform } from 'react-native';
import { createStackNavigator } from "react-navigation";
import TabBarIcon from '../components/TabBarIcon';

import TrialMainScreen from "../screens/trials/TrialMainScreen";
import TrialTypeSelectionScreen from "../screens/trials/TrialTypeSelectionScreen";
import TrialTypeOverviewScreen from "../screens/trials/TrialTypeOverviewScreen";
import TrialVarSelectionScreen from "../screens/trials/TrialVarSelectionScreen";
import TrialDateSelectionScreen from "../screens/trials/TrialDateSelectionScreen";
import TrialReminderConfigScreen from "../screens/trials/TrialReminderConfigScreen";
import TrialSummaryScreen from "../screens/trials/TrialSummaryScreen";
import {ScreenNames} from "../constants/Screens";

// let routeConfigs = {};
// routeConfigs[ScreenNames.TrialMain] = TrialMainScreen;
// routeConfigs[ScreenNames.TrialCreate] = TrialCreateScreen;

let TrialStack = createStackNavigator(
  {
    TrialMain: TrialMainScreen, 
    TrialTypeSelection: TrialTypeSelectionScreen,
    TrialTypeOverview: TrialTypeOverviewScreen,
    TrialVarSelection: TrialVarSelectionScreen,
    TrialDateSelection: TrialDateSelectionScreen,
    TrialReminderConfig: TrialReminderConfigScreen,
    TrialSummary: TrialSummaryScreen
  },
  {
    initialRouteName: ScreenNames.TrialMain
  }
)

TrialStack.navigationOptions = {
  tabBarLabel: 'Trials',
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

export default TrialStack;