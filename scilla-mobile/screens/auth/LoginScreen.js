// @flow
import React from "react";
import {
  Text,
  View, 
  Button,
  TextInput, 
  StyleSheet,
  AsyncStorage
} from 'react-native';
import * as firebase from 'firebase'; 
import BaseScreen from "../BaseScreen";
import appService from "../../AppService";
import { ScreenNames } from "../../constants/Screens";

export default class LoginScreen extends BaseScreen {
  state = {
    email: '', 
    password: '', 
    errorMessage: null
  }

  static navigationOptions = {
    title: "Please sign in"
  };

  handleLogin = () => {
    console.log("handle login");

    appService.auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then( () => this.navigate(ScreenNames.Main))
      .catch( error => this.setState({ errorMessage: error.message }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage && 
          <Text style={styles.errorMessage}>
            {this.state.errorMessage}  
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput 
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin}/>
        <Button 
          title="Don't have an account? Sign Up"
          onPress={() => this.navigate(ScreenNames.SignUp)}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40, 
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1, 
    marginTop: 8
  },
  errorMessage: {
    color: 'red'
  },
})