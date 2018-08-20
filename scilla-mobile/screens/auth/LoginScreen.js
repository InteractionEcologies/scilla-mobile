// @flow
import React from "react";
import {
  StyleSheet,
  AsyncStorage
} from 'react-native';
import {Content, Container,Text, View, 
  Button, Form, Item, Label, Input
} from 'native-base';
import * as firebase from 'firebase'; 
import BaseScreen from "../BaseScreen";
import appService from "../../app/AppService";
import { ScreenNames } from "../../constants/Screens";
import { AppText, Title } from "../../components";
import Colors from "../../constants/Colors";

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
      <Container>
        <Content contentContainerStyle={styles.content}>
          <Title>Login</Title>
          {this.state.errorMessage && 
            <AppText style={styles.errorMessage}>
              {this.state.errorMessage}  
            </AppText>}

          <Form style={styles.form}>
            <Item floatingLabel>
              {/* <AppLabel>Email</AppLabel> */}
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </Item>
            <Item floatingLabel>
              {/* <AppLabel>Password</AppLabel> */}
              <Label>Password</Label>
              <Input 
                secureTextEntry
                autoCapitalize="none"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
              />
            </Item>
            <Button full style={styles.loginBtn} onPress={this.handleLogin}>
              <AppText>Login</AppText>
            </Button>
          </Form>

          <AppText style={styles.clickableText} onPress={() => this.navigate(ScreenNames.SignUp)}>
            Don't have an account? Sign Up
          </AppText>
          
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'skyblue'
  },
  form: {
    // flex: 1, 
    width: '90%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'steelblue'
  },
  textInput: {
    // height: 40, 
    width: '100%',
    // borderColor: 'gray',
    // borderWidth: 1, 
    // marginTop: 8
  },
  errorMessage: {
    color: Colors.errorText
  },
  loginBtn: {
    marginTop: 8
  },
  clickableText: {
    marginTop: 8,
    fontSize: 12,
    color: 'blue'
  }
})