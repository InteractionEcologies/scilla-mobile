// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BaseScreen from "../BaseScreen";

export default class TrialCreateScreen extends BaseScreen {
    render() {
      return (
        <View style={styles.trial}>
          <Text>Trial Creation Screen</Text>
        </View>
      )
    }
  }

const styles = StyleSheet.create({
  trial: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
});
