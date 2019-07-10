// @flow
import React from "react";
import { createStackNavigator } from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";
import { Platform } from "react-native";
import SettingsScreen from "../screens/settings/SettingsScreen";
import { ScreenNames } from "../constants/Screens";

let SettingsStack = createStackNavigator(
  {
    [ScreenNames.SettingsMain]: SettingsScreen
  },
  {
    initialRouteName: ScreenNames.SettingsMain
  }

)

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options` : 'md-options'}
    />
  ),
};

export default SettingsStack
