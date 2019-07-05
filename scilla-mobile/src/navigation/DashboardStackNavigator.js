// @flow
import React from 'react';
import { Platform } from "react-native";
import { createStackNavigator } from 'react-navigation';
import DashboardMainScreen from "../screens/dashboard/DashboardMainScreen";
import ReportSelectionScreen from "../screens/reports/ReportSelectionScreen";
import TabBarIcon from "../components/TabBarIcon";
import { ScreenNames } from "../constants/Screens";
import ReportMeasurmentScreen from '../screens/reports/ReportMeasurementScreen';

let DashboardStack = createStackNavigator({
  [ScreenNames.DashboardMain]: DashboardMainScreen,
  [ScreenNames.ReportSelection]: ReportSelectionScreen,
  [ScreenNames.ReportMeasurement]: ReportMeasurmentScreen
});

DashboardStack.navigationOptions = {
  tabBarLabel: 'Today',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' 
            ? `ios-calendar` : 'md-calendar'}
    />
  ),
};

export default DashboardStack;