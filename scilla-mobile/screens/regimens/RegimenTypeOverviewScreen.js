// @flow
import React from "react";
import { StyleSheet } from "react-native";
import { Container, Content, View, Item, Input, Text, Button } from "native-base";
import { RegimenTypes } from "../../libs/intecojs";
import type { RegimenObject, RegimenType } from "../../libs/intecojs";

import styles from "./styles";
import { RegimenMaker } from "../../models/regimen";
import RegimenConfigView from "./components/RegimenConfigView";
import { ScreenNames } from "../../constants/Screens";

export default class RegimenTypeOverviewScreen extends React.Component<any, any> {
  regimenMaker: RegimenMaker; 
  state = {
    type: RegimenTypes.undefined
  }

  componentDidMount = () => {
    
  }

  goToNext = () => {
    // this.goToRegimenSummaryScreen();
    // this.props.navigation.navigate(ScreenNames.Sum)
  }

  render() {
    let params = this.props.navigation.state.params;
    let type = params.regimenMaker.type;

    return (
      <Container>
        <Content>
          {/* <Text>{this.state.regimenDesc}</Text> */}
          <RegimenConfigView type={type} />
          <Button title="Next" onPress={this.goToNext} />
        </Content>
      </Container>
    )
  }
}
