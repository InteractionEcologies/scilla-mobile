// @flow
import React from "react";
import { View, Text, Button } from "react-native";
import RegimenBaseScreen from "./RegimenBaseScreen";
import styles from "./styles";

export default class RegimenVarSelectionScreen extends RegimenBaseScreen {

  render() {
    return (
      <View style={styles.regimen}>
        <Text>Regimen Var Selection Screen</Text>
      </View>
    )
  }
}
