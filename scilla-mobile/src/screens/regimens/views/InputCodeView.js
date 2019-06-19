// @flow
import React, { Component } from 'react';
import styles from "../RegimenStyles";
import { 
  View, 
  Form, 
  Input,
  Item
} from "native-base";
import { 
  AppText,
  Title,
  DotPageIndicator 
} from "../../../components";
import { Col, Row, Grid } from 'react-native-easy-grid';

const customStyles = {
  form: {
    direction: 'row',
    justifyContent: 'space-between' 
  }
}

class InputCodeView extends Component<any, any> {
  render() {
    return (
      <View>
        <Title>Hello</Title>
        <AppText>Enter your 4-digit study code</AppText>
        <Form styles={customStyles.form}>
            <Item regular><Input /></Item>
        </Form>
      </View>
    )
  }
}

export default InputCodeView