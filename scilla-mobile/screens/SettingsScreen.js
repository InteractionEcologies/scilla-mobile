// @flow
import React from 'react';
import {
  View, 
  Button
} from 'react-native';
// import { ExpoConfigView } from '@expo/samples';
// import Auth from "../libs/Auth";
import appService from "../app/AppService";

export default class SettingsScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: 'app.json',
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
      <View>
        <Button title="Sign out" onPress={this.signOut} />
      </View>
    )
  }
}
