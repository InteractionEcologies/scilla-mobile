// @flow
import React from 'react';
import { Platform } from "react-native";
import { createStackNavigator } from 'react-navigation-stack';
// import { createStackNavigator } from "@react-navigation/stack";
import DashboardMainScreen from "../screens/dashboard/DashboardMainScreen";
import ReportSelectionScreen from "../screens/reports/ReportSelectionScreen";
import TabBarIcon from "../components/TabBarIcon";
import { ScreenNames } from "../constants/Screens";
import ReportMeasurmentScreen from '../screens/reports/ReportMeasurementScreen';

// const Stack = createStackNavigator();

// function DashboardStackNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name={ScreenNames.DashboardMain}
//         component={DashboardMainScreen}
//       />
//     </Stack.Navigator>
//   )
// }

// export default DashboardStackNavigator

let DashboardStack = createStackNavigator({
  [ScreenNames.DashboardMain]: DashboardMainScreen,
  [ScreenNames.ReportSelection]: ReportSelectionScreen,
  [ScreenNames.ReportMeasurement]: ReportMeasurmentScreen
});

DashboardStack.navigationOptions = {
  tabBarLabel: 'Dashboard',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' 
            ? `ios-calendar` : 'md-calendar'}
    />
  ),
};

export default DashboardStack;