// @flow
import React, { Component } from "react";

import type { IRegimen } from "../../../libs/scijs";

import {
  AppText,
  Title,
  DotPageIndicator
} from "../../../components"
import { View, Button } from "native-base";
import { StyleSheet } from "react-native";

type Props = {
  // All of the views inside my react-automata will be rendered 
  // at the beginning while there is no regimen. Thus, all the views
  // should handle situation when there is no regimen. 
  regimen: IRegimen,
  onConfirmed: () => Promise<void>,
  numStates: number, 
  currentStateIndex: number
}


class ConfirmRegimenView extends Component<Props, any> {
  
  confirm = () => {
    this.props.onConfirmed();
  }

  render = () => {
    let { regimen } = this.props;
    const param = regimen.regimenParam;

    return (
      <View style={customStyles.view}>
        
          <Title>Your Regimen</Title>
          <DotPageIndicator 
            totalDots={this.props.numStates}
            activeDotIndex={this.props.currentStateIndex}
            dotColor='grey'
            activeDotColor='black'  

            style={{marginBottom: 10}}  
          />

        <View style={customStyles.row}>
          <AppText style={customStyles.leftText}>Medicine</AppText>
          <AppText style={customStyles.rightText}>Baclofen</AppText>
        </View>
        <View style={customStyles.row}>
          <AppText style={customStyles.leftText}>Start dosage</AppText>
          <AppText style={customStyles.rightText}>{param.startDosageMg} mg</AppText>
        </View>
        <View style={customStyles.row}>
          <AppText style={customStyles.leftText}>Increment</AppText>
          <AppText style={customStyles.rightText}>{param.incrementMg} mg</AppText>
        </View>
        <View style={customStyles.row}>
          <AppText style={customStyles.leftText}>Phase Length</AppText>
          <AppText style={customStyles.rightText}>{param.phaseLengthDays} days</AppText>
        </View>
        <View style={customStyles.row}>
          <AppText style={customStyles.leftText}>Max dosage</AppText>
          <AppText style={customStyles.rightText}>{param.maxDosageMg} mg</AppText>
        </View>
        <Button
          style={customStyles.button}
          full
          onPress={this.confirm}>
          <AppText>Confirm</AppText>
        </Button>
      </View>
    )
  }
}


const customStyles = StyleSheet.create({
  view: {
    flexDirection: "column", 
    justifyContent: "flex-start",
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
  },
  leftText: {
    textAlign: 'right',
    paddingRight: 10,
    flex: 1
  },
  rightText: {
    textAlign: 'left', 
    paddingLeft: 10,
    flex: 1
  },
  button: {
    marginTop: 10,
  }
});

export default ConfirmRegimenView;