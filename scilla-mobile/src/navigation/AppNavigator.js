// @flow
import { 
  createAppContainer,
  createSwitchNavigator
} from "react-navigation"
import { createStackNavigator } from "react-navigation-stack";
import MainTabNavigator from './MainTabNavigator';
import AuthSwitchNavigator from './AuthSwitchNavigator';
import { ScreenNames } from "../constants/Screens";
import RegimenPhaseTransitionScreen from "../screens/dialogue/RegimenPhaseTransitionScreen";

const MainOrAuthSwitchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Auth: AuthSwitchNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
);


const AppNavigator = createStackNavigator(
  {
    [ScreenNames.MainOrAuthSwitchNavigator]: MainOrAuthSwitchNavigator,
    [ScreenNames.RegimenPhaseTransition]: RegimenPhaseTransitionScreen
  },
  {
    initialRouteName: ScreenNames.MainOrAuthSwitchNavigator, 
    mode: 'modal', 
    headerMode: 'none', // use "none" to remove header bar and back button. 
    // cardStyle: { backgroundColor: 'transparent'},
    
    // disable transition animation as this stack is used for showing dialogues
    // We use a modal inside each dialogue that can handle swipe to dismiss, 
    // if we add a transition here, a dialgue will hang a bit as the swipe gesture is 
    // completed, as the dialogue screen will need to wait for react-navigation's 
    // transition animation to complete. 
    // transitionConfig: () => ({
    //   transitionSpec: {
    //       duration: 0,
    //   },
    // }),

    // Disable swipe down to dismiss
    navigationOptions: {
      gesturesEnabled: false,
    },
  }
)

const AppContainer = createAppContainer<any, any>(AppNavigator);

export default AppContainer;