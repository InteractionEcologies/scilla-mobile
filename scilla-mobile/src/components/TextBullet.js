// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export class TextBullet extends React.Component<any, any> {
  static defaultProps = {
    text: "Hello"
  }
  render() {
    return (
      <View style={styles.bulletRow}>
        <View style={styles.bullet}>
          <Text>{'\u2022' + " "}</Text>
        </View>
        <View style={styles.bulletText}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bulletRow: {
    flexDirection: 'row',
    // marginTop: 8
    marginBottom: 8
  },
  bullet: {
    width: 10
  },
  bulletText: {

  }
});