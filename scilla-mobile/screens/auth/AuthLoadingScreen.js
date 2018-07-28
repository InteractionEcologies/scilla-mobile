import React from "react";
import { View, Text} from "react-native";
import {
  StyleSheet,
  ActivityIndicator, 
  StatusBar,
  AsyncStorage
} from "react-native";

import * as firebase from "firebase";


export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Main': 'Login');
    });
  }

  _bootstrapAsync = async() => {
    // const userToken = await AsyncStorage.getItem('userToken');
    // this.props.navigation.navigate(userToken ? 'App': 'Auth');

  }

  render() {
    return (
      <View styles={styles.container}>
        <ActivityIndicator size="large" />
        <StatusBar barStatus="default" />
        <Text>Loading</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  }
})