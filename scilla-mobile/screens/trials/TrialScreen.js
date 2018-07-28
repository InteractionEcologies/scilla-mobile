import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class TrialScreen extends React.Component {
    render() {
      return (
        <View style={styles.trial}>
          <Text>Trial Screen</Text>
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
