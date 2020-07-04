// @flow
import 'react-native-gesture-handler';
import React from 'react';
import { 
  AppState, 
  StyleSheet,
  View,
  Platform,
  YellowBox,
  StatusBar
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as Icon from '@expo/vector-icons'

import { StyleProvider, Root } from "native-base";
import getTheme from "./src/constants/native-base-theme/components";
import commonColor from "./src/constants/native-base-theme/variables/commonColor";

import AppContainer from "./src/navigation/AppNavigator";
import AppInitializer from "./src/services/AppInitializer";
import NavigationService from "./src/navigation/NavigationService";

const SCOPE = "App";

export default class App extends React.Component<any, any> {
  appInitializer = new AppInitializer();
  state = {
    isLoadingComplete: false,
    appState: AppState.currentState
  };

  constructor(props: any) {
    super(props);

    this.appInitializer.onAppStart();
  }

  async componentDidMount() {
    // FIXME: NativeBase has an issue with the latest React Native. 
    // A fix is in NativeBase but the new version is not yet released. 
    YellowBox.ignoreWarnings([
      'Animated: `useNativeDriver`',
    ]);
    
    AppState.addEventListener('change', this._handleAppStateChange);

    try {
      // TODO: SplashScreen auto hide issue
      // It shows an error "Native splash screen is already hidden"
      // Still not sure what it means. Need to fix this. 
      // await SplashScreen.preventAutoHideAsync();
      // Also a relevant issue: https://github.com/expo/expo/issues/7689
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
      <StyleProvider style={getTheme(commonColor)}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {/* Root is used to support ActionSheet and Toast. */}
          <Root>
            {/* Native Base Container */}
            {/* <Container> */}
              {/* React Navigation Container */}
              <AppContainer 
                ref={navigatorRef => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
              />
            {/* </Container> */}
          </Root>
        </View>
      </StyleProvider>
    )

  }

  _handleAppStateChange = (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.appInitializer.onEnterForeground();
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