// @flow
import React from "react";
import { View, Text, Button } from "react-native";
import TrialBaseScreen from "./TrialBaseScreen";
import styles from "./styles";

export default class TrialVarSelectionScreen extends TrialBaseScreen {

  render() {
    return (
      <View style={styles.trial}>
        <Text>Trial Var Selection Screen</Text>
      </View>
    )
  }
}
