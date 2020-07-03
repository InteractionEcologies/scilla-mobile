import React from "react";
// import { createSwitchNavigator, createStackNavigator} from "react-navigation";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";

// const AuthSwitchNavigator = createSwitchNavigator(
//   { 
//     AuthLoading: AuthLoadingScreen,
//     Login: LoginScreen,
//     SignUp: SignUpScreen,
//   },
//   {
//     initialRouteName: 'AuthLoading'
//   }
// );

// export default AuthSwitchNavigator;

const AuthSwitch = createStackNavigator();

function AuthSwitchNavigator() {
  return (
    <AuthSwitch.Navigator
      initialRouteName="AuthLoading"
    >
      <AuthSwitch.Screen
        name="AuthLoading"
        component={AuthLoadingScreen}
      />
      <AuthSwitch.Screen
        name="Login"
        component={LoginScreen}
      />
      <AuthSwitch.Screen
        name="SignUp"
        component={SignUpScreen}
      />
    </AuthSwitch.Navigator>
  )
}

export default AuthSwitchNavigator;