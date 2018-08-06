// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TrialBaseScreen from "./TrialBaseScreen";
import styles from "./styles";

export default class TrialSummaryScreen extends TrialBaseScreen {
  render() {
    return (
      <View style={styles.trial}>
        <Text>Trial Summary Screen</Text>
      </View>
    )
  }
}
