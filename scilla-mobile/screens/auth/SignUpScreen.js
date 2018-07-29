import React from "react";
import {
  StyleSheet, Text, TextInput, View, Button
} from "react-native"
import firebase from 'firebase';
import Auth from "../../utils/Auth";

export default class SignUpScreen extends React.Component {
  state = {
    email: '', 
    password: '', 
    errorMessage: null,
  }

  handleSignUp = () => {
    console.log("handleSignUp");
    Auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch( error => this.setState({ errorMessage: error.message }))
    
      // firebase
      // .auth()
      // .createUserWithEmailAndPassword(this.state.email, this.state.password)
  }

  _createUserProfile = async () => {
    let user = firebase.auth().currentUser;
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
          onPress={ () => this.props.navigation.navigate('SignIn')}
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