// @flow
import React from "react";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    width: '90%'
  },
  errorMessage: {
    color: Colors.errorText
  },
  button: {
    marginTop: 8
  },
  clickableText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.clickableText
  }
})

export default styles;