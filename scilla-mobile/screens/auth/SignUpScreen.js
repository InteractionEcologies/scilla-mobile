// @flow
import React from "react";
import {
  StyleSheet, Text, TextInput, View, Button
} from "react-native"
// import Auth from "../../libs/Auth";
import appService from "../../AppService";
import { ScreenNames } from "../../constants/Screens";
import BaseScreen from "../BaseScreen";

export default class SignUpScreen extends BaseScreen {
  state = {
    email: '', 
    password: '', 
    errorMessage: null,
  }

  handleSignUp = () => {
    console.log("handleSignUp");
    appService.auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.navigate(ScreenNames.Main))
      .catch( error => this.setState({ errorMessage: error.message }))
    
  }

  _createUserProfile = async () => {
    let user = appService.auth.currentUser;
    let profile = {
      uid: user.uid,
      email: user.email, 
      first_name: "",
      last_name: ""
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage && 
        <Text style={styles.errorMessage}>
          {this.state.errorMessage}
        </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button 
          title="Already have an account? Login"
          onPress={ () => this.navigate(ScreenNames.Login)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
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
  }
});