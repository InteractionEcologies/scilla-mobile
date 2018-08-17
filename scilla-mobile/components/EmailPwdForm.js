// @flow
import React from "react";
import { View, Text, Form, StyleSheet } from "react-native";

export class EmailPwdForm extends React.Component<any, any> {
  static defaultProps = {
    text: "Hello"
  }
  render() {
    return (
      <Form style={styles.form}>
        {this.props.children}
      </Form>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    width: '90%',
  },
});