import React from "react";
// import {
//   createSwit
// } from 'react-navigation';
import { createStackNavigator } from 'react-navigation'

export default createStackNavigator(
  {
    GeneralSetup: GeneralSetupScreen
  },
  {
    initialRouteName: 'GeneralSetup'
  }
)