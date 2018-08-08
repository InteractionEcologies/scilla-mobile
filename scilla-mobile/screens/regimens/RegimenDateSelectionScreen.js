// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RegimenBaseScreen from "./RegimenBaseScreen";
import styles from "./styles";

export default class RegimenDateSelectionScreen extends RegimenBaseScreen {
  render() {
    return (
      <View style={styles.regimen}>
        <Text>Regimen Date Selection Screen</Text>
      </View>
    )
  }
}
