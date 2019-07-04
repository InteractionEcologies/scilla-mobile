// @flow
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { AppText, Title } from "../../components";
import { View, Button } from "native-base";
import { Styles as AppStyles } from "../../constants/Styles";
import styles from "./RegimenStyles";

export default class RegimenEditScreen extends Component<any, any> {

  handleIncreaseDosage = () => {

  }

  handleDecreaseDosage = () => {

  }

  handleExtendDosage = () => {

  }

  render() {
    return (
      <View style={AppStyles.contentBody}>
        <Title style={{fontSize: 20, marginBottom: 10}}>Regimen Actions</Title>
        <Button 
          full
          disabled
          style={customStyles.button}
          onPress={this.handleIncreaseDosage}
        >
          <AppText>Increase Dosage</AppText>
        </Button>
        <Button
          full
          disabled
          style={customStyles.button}
          onPress={this.handleDecreaseDosage}
        >
          <AppText>Decrease Dosage</AppText>
        </Button>
        <Button
          full
          disabled
          style={customStyles.button}
          onPress={this.handleExtendDosage}
        >
          <AppText>Extend Current Phase</AppText>
        </Button>
        <Button 
          style={customStyles.button}
          full
          disabled
        >
          <AppText>Select Ideal Dosage</AppText>
        </Button>
      </View>
    )
  }
}

const customStyles = StyleSheet.create({
  button: {
    marginBottom: 10
  }
})