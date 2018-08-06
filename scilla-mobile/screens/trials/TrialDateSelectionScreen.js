// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TrialBaseScreen from "./TrialBaseScreen";
import styles from "./styles";

export default class TrialDateSelectionScreen extends TrialBaseScreen {
  render() {
    return (
      <View style={styles.trial}>
        <Text>Trial Date Selection Screen</Text>
      </View>
    )
  }
}
