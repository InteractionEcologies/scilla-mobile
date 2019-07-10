// @flow
import React from "react";
import { Container, Content, Button, Form, 
  Label, Item, Input
} from "native-base";
import { AppText, Title } from "../../components"
// import Auth from "../../libs/Auth";
import { ScreenNames } from "../../constants/Screens";
import AuthStyles from "./AuthStyles";

import AppService from "../../services/AppService";
const appService = new AppService();


export default class SignUpScreen extends React.Component<any, any> {
  state = {
    email: '', 
    password: '', 
    errorMessage: null,
  }

  componentDidMount() {
    // let user = appService.auth.currentUser;
    // console.log(user);
  }

  handleSignUp = () => {
    console.log("handleSignUp");
    appService.auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this._createDefaultUserProfile();
      })
      .then(() => this.props.navigation.navigate(ScreenNames.Main))
      .catch( error => this.setState({ errorMessage: error.message }))
  }

  _createDefaultUserProfile() {
    appService.ds.upsertUserProfile({
      uid: appService.auth.currentUser.uid, 
      firstName: "",
      lastName: "",
      email: appService.auth.currentUser.email,
      role: "patient"
    })
  }

  render() {
    return (
      <Container>
      <Content contentContainerStyle={AuthStyles.content}>
        <Title>Sign Up</Title>
        
        {this.state.errorMessage && 
          <AppText style={AuthStyles.errorMessage}>
            {this.state.errorMessage}
          </AppText>
        }

        <Form style={AuthStyles.form}>
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
          <Button full style={AuthStyles.button} onPress={this.handleSignUp}>
            <AppText>Sign Up</AppText>
          </Button>
        </Form>

        <AppText 
          style={AuthStyles.clickableText} 
          onPress={ () => this.props.navigation.navigate(ScreenNames.Login)}>
          Already have an account? Login
        </AppText>
      </Content>
      </Container>
    )
  }
}
