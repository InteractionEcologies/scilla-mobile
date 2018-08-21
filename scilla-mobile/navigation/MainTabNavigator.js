// @flow
import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import DashboardMainScreen from "../screens/dashboard/DashboardMainScreen";
import RegimenStack from "./RegimenStackNavigator";
import ReportStack from "./ReportStackNavigator";
import AnalysisStack from "./AnalysisStackNavigator";

const DashboardStack = createStackNavigator({
  Main: DashboardMainScreen,
});

DashboardStack.navigationOptions = {
  tabBarLabel: 'Today',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' 
            ? `ios-calendar${focused ? '' : '-outline'}` : 'md-calendar'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
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
