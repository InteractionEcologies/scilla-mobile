// @flow
import React from 'react';
import {
  View, StyleSheet, ScrollView
} from 'react-native';
import { 
  Button, 
} from "native-base";
import {
  AppText
} from "../../components";
import { Styles as AppStyles } from "../../constants/Styles";

// import { ExpoConfigView } from '@expo/samples';
// import Auth from "../libs/Auth";
import AppService from "../../services/AppService";
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

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[AppStyles.contentBody, styles.contentBody]}>
            <Button onPress={this.signOut} block>
              <AppText>Sign Out</AppText>
            </Button>
          </View>
          
        </ScrollView>

    )
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1, 
    width: '100%', 
    paddingRight: 10, 
    paddingLeft: 10
  },
  contentBody: {
  
  }
})