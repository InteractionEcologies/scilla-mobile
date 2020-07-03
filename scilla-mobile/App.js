// @flow
import 'react-native-gesture-handler';
import React from 'react';
import { 
  AppState, 
  StyleSheet,
  View,
  Text 
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as Icon from '@expo/vector-icons'
import AppContainer from "./src/navigation/AppNavigatorV2";

const SCOPE = "App";

export default class App extends React.Component<any, any> {
  state = {
    isLoadingComplete: false,
    appState: AppState.currentState
  };

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    try {
      // TODO: SplashScreen auto hide issue
      // It shows an error "Native splash screen is already hidden"
      // Still not sure what it means. Need to fix this. 
      // await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }

    this._loadResourcesAsync();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return null;
    }
    
    return (
      <View style={styles.container}>
        <AppContainer/>
      </View>
    )
    
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

    await Promise.all([
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

    this.setState({ isLoadingComplete: true}, async () => {
      await SplashScreen.hideAsync();
    })
  };  

}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    // alignItems: 'center',
    // justifyContent: 'center'
  }
})