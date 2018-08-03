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

export default class LoginScreen extends React.Component<any, any> {
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

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then( () => this.props.navigation.navigate('Main'))
      .catch( error => this.setState({ errorMessage: error.message }))

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage && 
          <Text style={styles.errorMessage}>
            {this.state.errorMessage}  
          </Text>}
        {/* <Button title="Sign In" onPress={this._signInAsync} /> */}
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
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      </View>
    )
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
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