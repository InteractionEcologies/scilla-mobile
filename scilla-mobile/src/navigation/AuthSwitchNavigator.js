import React from "react";
import { createSwitchNavigator, createStackNavigator} from "react-navigation";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";

const AuthSwitchNavigator = createSwitchNavigator(
  { 
    AuthLoading: AuthLoadingScreen,
    Login: LoginScreen,
    SignUp: SignUpScreen,
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

export default AuthSwitchNavigator;
