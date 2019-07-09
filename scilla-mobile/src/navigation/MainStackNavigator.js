import RegimenPhaseTransitionScreen from "../screens/dialogue/RegimenPhaseTransitionScreen";
import RegimenPhaseManualUpdateScreen from "../screens/dialogue/RegimenPhaseManualUpdateScreen";
import MainTabNavigator from "./MainTabNavigator";
import { createStackNavigator } from "react-navigation";
import { ScreenNames } from "../constants/Screens";

export default createStackNavigator(
  {
    [ScreenNames.MainTabNavigator]: MainTabNavigator,
    [ScreenNames.RegimenPhaseTransition]: RegimenPhaseTransitionScreen,
    [ScreenNames.RegimenPhaseManualUpdate]: RegimenPhaseManualUpdateScreen
  },
  {
    initialRouteName: ScreenNames.MainTabNavigator, 
    mode: 'modal', 
    headerMode: 'none'
  }
)