// @flow
import React from "react";
import { StyleSheet } from 'react-native';
import {
  Content, Container,Text, View, Button, Form, Item, Label, Input
} from 'native-base'; 
import { AppText, Title } from "../../components";

import { ScreenNames } from "../../constants/Screens";
import Colors from "../../constants/Colors";
import { Styles as AppStyles } from "../../constants/Styles";
import AppService from "../../services/AppService";
const appService = new AppService();

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

    appService.auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then( () => this.props.navigation.navigate(ScreenNames.Main))
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
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </Item>
            <Item floatingLabel>
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

          <AppText 
            style={styles.clickableText} 
            onPress={() => this.props.navigation.navigate(ScreenNames.SignUp)}>
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
    backgroundColor: Colors.surfaceColor
  },
  form: {
    width: '90%'
  },
  textInput: {
    width: '100%'
  },
  errorMessage: {
    color: Colors.errorColor
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