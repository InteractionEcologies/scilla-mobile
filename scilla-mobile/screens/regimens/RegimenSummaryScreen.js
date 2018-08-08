// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RegimenBaseScreen from "./RegimenBaseScreen";
import styles from "./styles";

export default class RegimenSummaryScreen extends RegimenBaseScreen {
  render() {
    return (
      <View style={styles.regimen}>
        <Text>Regimen Summary Screen</Text>
      </View>
    )
  }
}
