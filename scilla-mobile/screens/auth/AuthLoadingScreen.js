// @flow
import React from "react";
import * as firebase from "firebase";

import { ScreenNames } from "../../constants/Screens";
import AppService from "../../app/AppService";
const appService = new AppService();
import AppState from "../../app/AppState";

import { View, Text, StyleSheet, ActivityIndicator, 
  StatusBar, AsyncStorage, Image
} from "react-native";
import { Content, Container  } from "native-base";

import { AppText, Title } from "../../components"

export default class AuthLoadingScreen extends React.Component<any, any> {
  
  componentDidMount() {
    appService.auth.onAuthStateChanged(async (user) => {
      if(user) {
        await this._initializeAppState();
      }
      this.props.navigation.navigate(user ? ScreenNames.Main: ScreenNames.Login);
    })
  }

  _initializeAppState = async () => {
    let appState = new AppState();
    return appState.initialize();
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <Image style={styles.welcomeImage} source={require('../../assets/images/scilla-icon.png')}/>
          <Title>Find the Optimal Spasticity Care</Title>
          <ActivityIndicator style={styles.ActivityIndicator} size="large" />
          <StatusBar barStatus="default" />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  welcomeImage: {
    width: 200,
    height: 160,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  ActivityIndicator: {
    marginTop: 8
  }
})