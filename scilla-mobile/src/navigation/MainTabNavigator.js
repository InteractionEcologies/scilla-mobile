// @flow
import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SettingsScreen from '../screens/SettingsScreen';

import RegimenStack from "./RegimenStackNavigator";
import ReportStack from "./ReportStackNavigator";
import AnalysisStack from "./AnalysisStackNavigator";
import DashboardStack from "./DashboardStackNavigator";

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options` : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  DashboardStack,
  RegimenStack,
  ReportStack,
  AnalysisStack,
  SettingsStack, //TODO: need to move this out from the tab bar. 
});
