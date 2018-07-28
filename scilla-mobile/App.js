import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import * as firebase from 'firebase';
import FirebaseConfig from "./constants/FirebaseConfig";

firebase.initializeApp(FirebaseConfig);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

/** Old code */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
// import React from 'react';
// import { View, Text, StyleSheet} from 'react-native';

// import { 
//   createBottomTabNavigator, 
//   createStackNavigator,
//   createSwitchNavigator
// } from 'react-navigation';

// import TrialScreen from "./screens/trials/TrialScreen";
// import SignInScreen from "./screens/auth/SignInScreen";
// import AuthLoadingScreen from "./screens/auth/AuthLoadingScreen";

// // import firebase from "react-native-firebase";

// const AppStack = createStackNavigator({
//   Trial: TrialScreen
// });

// const AuthStack = createStackNavigator({
//   SignIn: SignInScreen
// });

// export default createSwitchNavigator(
//   {
//     AuthLoading: AuthLoadingScreen,
//     Auth: AuthStack,
//     App: AppStack
//   }, 
//   {
//     initialRouteName: 'AuthLoading',
//   }
// );

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
