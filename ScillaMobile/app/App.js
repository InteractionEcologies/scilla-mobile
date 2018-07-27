/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { 
  createBottomTabNavigator, 
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';

import TrialScreen from "./screens/trials/TrialScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import AuthLoadingScreen from "./screens/auth/AuthLoadingScreen";

const AppStack = createStackNavigator({
  Trial: TrialScreen
});

const AuthStack = createStackNavigator({
  SignIn: SignInScreen
});

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack
  }, 
  {
    initialRouteName: 'AuthLoading',
  }
);

// export default createStackNavigator({
//   Home: {
//     screen: TrialScreen
//   },
// });

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Home!</Text>
//       </View>
//     )
//   }
// }

// class SettingsScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Settings</Text>
//       </View>
//     )
//   }
// }

// // const styles = StyleSheet.create({

// // })
// const RootTabBar = createBottomTabNavigator({
//   Home: HomeScreen, 
//   Settings: SettingsScreen
// });

// export default class App extends React.Component {
//   render() {
//     return (
//       <RootTabBar />
//     )
//   }
// }
