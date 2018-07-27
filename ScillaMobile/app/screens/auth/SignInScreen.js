import React from "react";
import {
  View, 
  Button,
  AsyncStorage
} from 'react-native';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Please sign in"
  };

  render() {
    <View>
      <Button title="Sign In" onPress={this._signInAsync} />
    </View>
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  }
}