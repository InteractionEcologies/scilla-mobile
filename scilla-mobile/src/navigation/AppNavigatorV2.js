// @flow
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenNames } from "../constants/Screens"

// import RegimenPhaseTransitionScreen from '../screens/dialogue/RegimenPhaseTransitionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import NavigationService from "./NavigationService";

const Stack = createStackNavigator();

function AppContainer() {
  return (
    <NavigationContainer ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }}>
      <Stack.Navigator>
        <Stack.Screen name={ScreenNames.Login} component={LoginScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default AppContainer;