// @flow
import React from "react";
import { createBottomTabNavigator } from 'react-navigation-tabs';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import RegimenStack from "./RegimenStackNavigator";
import ReportStack from "./ReportStackNavigator";
import AnalysisStack from "./AnalysisStackNavigator";
import DashboardStack from "./DashboardStackNavigator";
import SettingsStack from "./SettingsStackNavigator";

// const Tab = createBottomTabNavigator();

// function MainTabNavigator() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen 
//         name="DashboardStack"
//         component={DashboardStack}
//         options={ 
//           {
//             tabBarLabel: "Dashboard"
//           }
//         }
//       />
//     </Tab.Navigator>
//   )
// }

// export default MainTabNavigator;

export default createBottomTabNavigator({
  DashboardStack,
  RegimenStack,
  ReportStack,
  AnalysisStack,
  SettingsStack, //TODO: need to move this out from the tab bar. 
});
