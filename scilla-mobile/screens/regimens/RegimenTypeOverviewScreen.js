// @flow
import React from "react";
import { StyleSheet } from "react-native";
import { Container, Content, View, Item, Input, Text, Button } from "native-base";
import RegimenBaseScreen from "./RegimenBaseScreen";
import styles from "./styles";
import { RegimenMaker } from "../../libs/RegimenMaker";
import type { RegimenObject, RegimentOption } from "../../libs/intecojs/types";
import { RegimenOptions } from "../../libs/intecojs/types";
import RegimenConfigView from "./components/RegimenConfigView";

export default class RegimenTypeOverviewScreen extends RegimenBaseScreen {
  regimenMaker: RegimenMaker; 
  state = {
    type: RegimenOptions.undefined
  }

  componentDidMount = () => {
    let params = this.getNavParams();
    this.regimenMaker = params.regimenMaker;
    let type = this.regimenMaker.getRegimenType();
    this.setState({
      type: type
    })
  }

  // getRegimenDescription(type: RegimentOption): string {
  //   let desc: string = "";
  //   console.log(type);
  //   switch(type) {
  //     case RegimenOptions.incBaclofen: 
  //     desc = "In this regimen, you will experiment how increasing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
  //         break;
  //     case RegimenOptions.decBaclofen:
  //       desc = "In this regimen, you will experiment how reducing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
  //         break;
  //     case RegimenOptions.none:
  //       desc = "No type of regimen is selected.";
  //       break;
  //     default:
  //       desc = "No type of regimen is selected."
  //   }
  //   return desc
  // }

  goToNext = () => {
    this.goToRegimenSummaryScreen();
  }

  // _getDescAndArgs(): any {
  //   let type = this.regimenMaker.getRegimenType();
  //   switch(type) {
  //     case RegimenOptions.incBaclofen: {
  //       let desc = "In this regimen, you will experiment how increasing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
  //       return (
  //         <View>
  //           <Text>{desc}</Text>
  //           <Item>
  //             <Input placeholder="Current Baclofen Dosage Per Day"/>
  //           </Item>
  //         </View>
  //       )
  //     }
  //     case RegimenOptions.decBaclofen: {
  //       let desc = "In this regimen, you will experiment how reducing Baclofen " + 
  //         "dosage affects your body such as severity of spasticity and tiredness. " + 
  //         "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
  //       return (
  //         <View>
  //           <Text>{desc}</Text>
  //           <Item>
  //             <Input placeholder="Current Baclofen Dosage Per Day"/>
  //           </Item>
  //         </View>
  //       )
  //     }
  //     case RegimenOptions.none: {
  //       let desc = "No type of regimen is selected.";
  //       return (
  //         <Text>{desc}</Text>
  //       )
  //     }
  //     default: {
  //       let desc = "No type of regimen is selected.";
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
          {/* <Text>{this.state.regimenDesc}</Text> */}
          <RegimenConfigView type={this.state.type} />
          <Button title="Next" onPress={this.goToNext} />
        </Content>
      </Container>
    )
  }
}
