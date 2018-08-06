// @flow
import React from "react";
import { StyleSheet } from "react-native";
import { Container, Content, View, Item, Input, Text, Button } from "native-base";
import TrialBaseScreen from "./TrialBaseScreen";
import styles from "./styles";
import { TrialMaker } from "../../libs/Trial";
import type { TYTrial, TYTrialType } from "../../libs/intecojs/types";
import { TrialTypes } from "../../libs/intecojs/types";
import TrialConfigView from "../../components/TrialConfigView";

export default class TrialTypeOverviewScreen extends TrialBaseScreen {
  trialMaker: TrialMaker; 
  state = {
    type: TrialTypes.none
  }

  componentDidMount = () => {
    let params = this.getNavParams();
    this.trialMaker = params.trialMaker;
    let type = this.trialMaker.getTrialType();
    this.setState({
      type: type
    })
  }

  // getTrialDescription(type: TYTrialType): string {
  //   let desc: string = "";
  //   console.log(type);
  //   switch(type) {
  //     case TrialTypes.incBaclofen: 
  //     desc = "In this trial, you will experiment how increasing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This trial will take 1-6 weeks depending on your current Baclofen intake.";
  //         break;
  //     case TrialTypes.decBaclofen:
  //       desc = "In this trial, you will experiment how reducing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This trial will take 1-6 weeks depending on your current Baclofen intake.";
  //         break;
  //     case TrialTypes.none:
  //       desc = "No type of trial is selected.";
  //       break;
  //     default:
  //       desc = "No type of trial is selected."
  //   }
  //   return desc
  // }

  goToNext = () => {
    this.goToTrialSummaryScreen();
  }

  // _getDescAndArgs(): any {
  //   let type = this.trialMaker.getTrialType();
  //   switch(type) {
  //     case TrialTypes.incBaclofen: {
  //       let desc = "In this trial, you will experiment how increasing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This trial will take 1-6 weeks depending on your current Baclofen intake.";
  //       return (
  //         <View>
  //           <Text>{desc}</Text>
  //           <Item>
  //             <Input placeholder="Current Baclofen Dosage Per Day"/>
  //           </Item>
  //         </View>
  //       )
  //     }
  //     case TrialTypes.decBaclofen: {
  //       let desc = "In this trial, you will experiment how reducing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This trial will take 1-6 weeks depending on your current Baclofen intake.";
  //       return (
  //         <View>
  //           <Text>{desc}</Text>
  //           <Item>
  //             <Input placeholder="Current Baclofen Dosage Per Day"/>
  //           </Item>
  //         </View>
  //       )
  //     }
  //     case TrialTypes.none: {
  //       let desc = "No type of trial is selected.";
  //       return (
  //         <Text>{desc}</Text>
  //       )
  //     }
  //     default: {
  //       let desc = "No type of trial is selected.";
  //       return (
  //         <Text>{desc}</Text>
  //       )
  //     }
  //   }
  // }

  render() {
    // let components = this._getDescAndArgs();

    return (
      <Container>
        <Content>
          {/* <Text>{this.state.trialDesc}</Text> */}
          <TrialConfigView type={TrialTypes.incBaclofen} />
          <Button title="Next" onPress={this.goToNext} />
        </Content>
      </Container>
    )
  }
}
