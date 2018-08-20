// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Form, Item, Label, Input } from "native-base";
import { Title, AppText, DotPageIndicator
} from "../../../components";
import RegimenStyles from "../RegimenStyles";
import { RegimenTypes } from "../../../libs/intecojs";
import type { RegimenType } from "../../../libs/intecojs";
import _ from "lodash";

type Props = {
  numStates: number, 
  currentStateIndex: number,
  currentDoseMg: number,
  onCurrentDosageChanged: (number) => void
}


export default class ParamSetupView extends React.Component<Props, any> {

  handleDosageChange = (dosageMgStr: string) => {
    let dosageMg = parseInt(dosageMgStr, 10); 
    this.props.onCurrentDosageChanged(dosageMg);

  }

  render() {
    let dosageMg;
    if(_.isNaN(this.props.currentDoseMg)) {
      dosageMg = ""
    } else {
      dosageMg = `${this.props.currentDoseMg}`
    }

    return (
      <View>
        <Title>What's Your Current Dosage?</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          currentDotIndex={this.props.currentStateIndex}
          dotColor='grey'
          activeDotColor='black'  
        />
        <Form style={styles.form}>
          <Item floatingLabel>
            <Label>Baclofen Dosage Per Day (mg)</Label>
            <Input
              onChangeText={this.handleDosageChange}
              keyboardType = 'numeric'
              value={ dosageMg }
            />
          </Item>
        </Form>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    marginBottom: 8
  }
})