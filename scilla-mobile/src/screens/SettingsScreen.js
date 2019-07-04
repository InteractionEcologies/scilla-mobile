// @flow
import React from 'react';
import {
  View, StyleSheet, FlatList
} from 'react-native';
import { 
  Content, List, ListItem, Button, Container
} from "native-base";
import {
  AppText
} from "../components/";
import Colors from "../constants/Colors";
import { Styles as AppStyles } from "../constants/Styles";

// import { ExpoConfigView } from '@expo/samples';
// import Auth from "../libs/Auth";
import firebase from "firebase";
import AppService from "../services/AppService";
const appService = new AppService();

export default class SettingsScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: 'Settings',
  };

  constructor(props: any) {
    super(props);
  }

  signOut = () => {
    appService.auth.signOut()
      .then( () => this.props.navigation.navigate("Auth") );
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    // return <ExpoConfigView />;
    return (
      <Container>
        <Content contentContainerStyle={AppStyles.content}>
          <View style={[AppStyles.contentBody, styles.contentBody]}>
            <Button onPress={this.signOut} block>
              <AppText>Sign Out</AppText>
            </Button>
          </View>
          
        </Content>
      </Container>

    )
  }
}

const styles = StyleSheet.create({
  contentBody: {
    marginTop: 10
  }
})