// @flow
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "native-base";
import { AppText } from "./index";
import Fonts from "../constants/Fonts";

export class Title extends React.Component<any, any> {
  static defaultProps = {
    text: "Hello"
  }
  render() {
    return (
      <Text style={[styles.title, this.props.style]}>{this.props.children}</Text>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontFamily: Fonts.SpaceMonoBold,
    fontSize: 16,
    fontWeight: 'bold'
  }
});