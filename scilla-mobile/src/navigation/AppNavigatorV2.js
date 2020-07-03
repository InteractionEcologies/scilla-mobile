// @flow
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenNames } from "../constants/Screens"

// import RegimenPhaseTransitionScreen from '../screens/dialogue/RegimenPhaseTransitionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import NavigationService from "./NavigationService";
import RegimenPhaseTransitionScreen from '../screens/dialogue/RegimenPhaseTransitionScreen';
import AuthSwitchNavigator from './AuthSwitchNavigator';
import MainTabNavigator from './MainTabNavigator';

const RootStack = createStackNavigator();
const MainOrAuthStack = createStackNavigator();

// function MainOrAuthSwitchNavigator() {
//   return (
//     <MainOrAuthStack.Navigator
//       initialRouteName="Auth"
//     >
//       <MainOrAuthStack.Screen
//         name="Auth"
//         component={AuthSwitchNavigator}
//       />
//       <MainOrAuthStack.Screen
//         name="Main"
//         component={MainTabNavigator}
//       />
//     </MainOrAuthStack.Navigator>
//   )
// }

function MainOrAuthSwitchNavigator({navigation}) {
  
}


function AppContainer() {
  return (
    <NavigationContainer ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }}>
      <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name={ScreenNames.MainOrAuthSwitchNavigator}
        component={MainOrAuthSwitchNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name={ScreenNames.RegimenPhaseTransition}
        component={RegimenPhaseTransitionScreen}
        options={{
          // title: ""
        }}
      />
    </RootStack.Navigator>
    </NavigationContainer>
  );
}


export default AppContainer;