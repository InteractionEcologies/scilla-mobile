// @flow
import React from 'react';
import {
  View, StyleSheet, FlatList
} from 'react-native';
import { 
  Content, List, ListItem, Button
} from "native-base";
import {
  AppText
} from "../components/";
import Colors from "../constants/Colors";

// import { ExpoConfigView } from '@expo/samples';
// import Auth from "../libs/Auth";
import firebase from "firebase";
import AppService from "../app/AppService";
const appService = new AppService();

export default class SettingsScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: 'Settings',
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {

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
      <Content contentContainerStyle={styles.content}>
        <View style={styles.mainView}>
          <Button onPress={this.signOut} block style={styles.signOutBtn}>
            <AppText>Sign Out</AppText>
          </Button>
        </View>
        
      </Content>

    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.backgroundColor,
    flex: 1, 
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },
  mainView: {
    width: '90%',
  },
  signOutBtn: {
  }
})