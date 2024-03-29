// @flow
import React from "react";

import { ScreenNames } from "../../constants/Screens";

import AppStore from "../../services/AppStore";
import AppService from "../../services/AppService";


import { StyleSheet, Image
} from "react-native";
import { Content, Container  } from "native-base";

import { Styles as AppStyles } from "../../constants/Styles";
import Colors from "../../constants/Colors";

const appService = new AppService();

export default class AuthLoadingScreen extends React.Component<any, any> {
  
  componentDidMount() {
    appService.auth.onAuthStateChanged(async (user) => {
      // if(user) {
      //   await this._initializeAppStore();
      // }
      this.props.navigation.navigate(user ? ScreenNames.Main: ScreenNames.Login);
    })
  }

  _initializeAppStore = async () => {
    let appStore = new AppStore();
    return appStore.initialize();
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[AppStyles.content, styles.content]}>
          <Image style={styles.welcomeImage} source={require('../../../assets/images/scilla-icon.png')}/>
          {/* <Title>Find the Optimal Spasticity Care</Title> */}
          {/* <ActivityIndicator style={styles.ActivityIndicator} size="large" /> */}
          {/* <StatusBar barStatus="default" /> */}
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.primaryColor
  },
  welcomeImage: {
    width: 200,
    height: 160,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  ActivityIndicator: {
    marginTop: 8
  }
})