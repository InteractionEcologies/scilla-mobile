// @flow
import React from "react";
import * as firebase from "firebase";

import { ScreenNames } from "../../constants/Screens";
import appService from "../../app/AppService";

import { View, Text,StyleSheet, ActivityIndicator, 
  StatusBar, AsyncStorage,Image
} from "react-native";
import { Content  } from "native-base";

import BaseScreen from "../BaseScreen";
import { AppText, Title } from "../../components"


export default class AuthLoadingScreen extends BaseScreen {

  componentDidMount() {
    // firebase.auth().onAuthStateChanged(user => {
    //   this.props.navigation.navigate(user ? 'Main': 'Login');
    // });
    appService.auth.onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? ScreenNames.Main: ScreenNames.Login);
    })
    // var user = appService.auth.currentUser;
    // this.navigate(user? ScreenNames.Main: ScreenNames.Login);
    
  }

  render() {
    return (
      <Content contentContainerStyle={styles.content}>
        <Image style={styles.welcomeImage} source={require('../../assets/images/scilla-icon.png')}/>
        <Title>Find the Optimal Spasticity Care</Title>
        <ActivityIndicator style={styles.ActivityIndicator} size="large" />
        <StatusBar barStatus="default" />
      </Content>
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