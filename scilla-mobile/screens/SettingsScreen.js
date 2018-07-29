import React from 'react';
import {
  View, 
  Button
} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import Auth from "../utils/Auth";
import firebase from "firebase";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  constructor(props) {
    super(props);
    // this.auth = new Auth();
  }

  signOut = () => {
    Auth.signOut()
      .then( () => this.props.navigation.navigate("Auth") );
    // firebase
    //   .auth()
    //   .signOut()
    //   .then( () => this.props.navigation.navigate("Main"));
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
