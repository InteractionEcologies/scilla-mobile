import RegimenPhaseTransitionScreen from "../screens/dialogue/RegimenPhaseTransitionScreen";
import MainTabNavigator from "./MainTabNavigator";
import { createStackNavigator } from "react-navigation";
import { ScreenNames } from "../constants/Screens";

export default createStackNavigator(
  {
    [ScreenNames.MainTabNavigator]: MainTabNavigator,
    [ScreenNames.RegimenPhaseTransition]: RegimenPhaseTransitionScreen
  },
  {
    initialRouteName: ScreenNames.MainTabNavigator, 
    mode: 'modal', 
    headerMode: 'none'
  }
)