// @flow
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';

import { StyleProvider, Container, Root } from "native-base";
import getTheme from "./src/constants/native-base-theme/components";
import commonColor from "./src/constants/native-base-theme/variables/commonColor";
import AppContainer from './src/navigation/AppNavigator';
import AppService from "./src/app/AppService";
import Colors from "./src/constants/Colors";

export default class App extends React.Component<any, any> {
  state = {
    isLoadingComplete: false,
  };

  constructor(props: any) {
    super(props);
    this._initializeAppService();
  }

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
        <StyleProvider style={getTheme(commonColor)}>
          <View style={styles.main}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {/* Root is used to support ActionSheet and Toast. */}
            <Root>
              <Container>
                <AppContainer />
              </Container>
            </Root>
          </View>
        </StyleProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {

    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
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

  _initializeAppService = () => {
    let appService = new AppService();
    appService.initialize();
  }

  _handleLoadingError = (error: any) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
});