// @flow
import 'react-native-gesture-handler';
import React from 'react';
import { 
  AppState, 
  Platform, 
  StatusBar, 
  StyleSheet, 
  View,
  Text } from 'react-native';

// A React component that tells Expo to keep the app loading 
// screen open if it is the first and only component rendered in your app. 
import { AppLoading } from 'expo';
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as Icon from '@expo/vector-icons'

const SCOPE = "App";

export default class App extends React.Component<any, any> {
  state = {
    isLoadingComplete: false,
    appState: AppState.currentState
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  _handleAppStateChange = (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // this.appInitializer.onEnterForeground();
    }

    this.setState({appState: nextAppState});
  }

  _loadResourcesAsync = async () => {

    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/scilla-icon.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        'Roboto': require('./assets/fonts/Roboto.ttf'),
        'Roboto_medium': require('./assets/fonts/Roboto_medium.ttf'),
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'space-mono-bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
      }),
    ]);
  };


  _handleLoadingError = (error: any) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
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
        <View>
          <Text>Test</Text>
        </View>
      )
    }
  }

}
