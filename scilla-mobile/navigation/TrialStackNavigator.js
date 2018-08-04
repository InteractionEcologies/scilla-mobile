// @flow
import React from "react";
import { Platform } from 'react-native';
import { createStackNavigator } from "react-navigation";
import TabBarIcon from '../components/TabBarIcon';

import TrialMainScreen from "../screens/trials/TrialMainScreen";
import TrialCreateScreen from "../screens/trials/TrialCreateScreen";
import {ScreenNames} from "../constants/Screens";

// let routeConfigs = {};
// routeConfigs[ScreenNames.TrialMain] = TrialMainScreen;
// routeConfigs[ScreenNames.TrialCreate] = TrialCreateScreen;

let TrialStack = createStackNavigator(
  {
    TrialMain: TrialMainScreen, 
    TrialCreate: TrialCreateScreen,
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