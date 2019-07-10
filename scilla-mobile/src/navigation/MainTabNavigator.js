// @flow
import { createBottomTabNavigator } from 'react-navigation';

import RegimenStack from "./RegimenStackNavigator";
import ReportStack from "./ReportStackNavigator";
import AnalysisStack from "./AnalysisStackNavigator";
import DashboardStack from "./DashboardStackNavigator";
import SettingsStack from "./SettingsStackNavigator";

export default createBottomTabNavigator({
  DashboardStack,
  RegimenStack,
  ReportStack,
  AnalysisStack,
  SettingsStack, //TODO: need to move this out from the tab bar. 
});
