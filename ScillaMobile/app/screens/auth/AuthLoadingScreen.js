import React from "react";
import {
  StyleSheet,
  ActivityIndicator, 
  StatusBar,
  AsyncStorage
} from "react-native"

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  _bootstrapAsync = async() => {
    const userToken = await AsyncStorage.getItem('userToken');
    
    this.props.navigation.navigate(userToken ? 'App': 'Auth');

  }

  render() {
    return (
      <View styles={styles.container}>
        <ActivityIndicator />
        <StatusBar barStatus="default" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  }
})