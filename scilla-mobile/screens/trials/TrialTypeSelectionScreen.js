// @flow
import React from "react";
import { StyleSheet } from "react-native";
import {  Container, Content, Button, Text, List, 
  ListItem, Card, CardItem, Body, Header
} from "native-base";
import TrialBaseScreen from "./TrialBaseScreen";
import styles from "./styles";
import { TrialMaker } from "../../libs/Trial";
import appService from "../../AppService";
import type { TYTrial, TYTrialType} from "../../libs/intecojs/types"
import { TrialTypes,  } from "../../libs/intecojs/types";
import _ from "lodash";
import { ScreenNames } from "../../constants/Screens";

export default class TrialTypeSelectionScreen extends TrialBaseScreen {
  state = {
    trialType: null
  }
  static navigationOptions: any = {
    title: "Select Trial"
  }
  trialMaker: TrialMaker;

  componentDidMount() {
    this.trialMaker = new TrialMaker();
    let uid = appService.auth.currentUser.uid;
    this.trialMaker.setUserId(uid);
  }

  goToNext = () => {
    this.goToTypeOverviewScreen();
  }

  selectTrialType = (type: TYTrialType) => {
    console.log(`Select trial type = ${type}`);
    this.trialMaker.setTrialType(type);
    console.log(`Current trial type = ${this.trialMaker._data.type}`);
    this.navigate(ScreenNames.TrialTypeOverview, { trialMaker: this.trialMaker });
  }

  _getTrialTypeCards = (): List => {
    // const trialTypeList = TrialTypes.
    // _.
    let types = _.values(TrialTypes);
    console.log(types);
    let cards: Card[] = [];
    types.forEach( (type) => {

      console.log(type);

      switch(type) {
        case TrialTypes.incBaclofen: 
          cards.push(
            <Card key={type}>
              <CardItem key={type} button onPress={ () => this.selectTrialType(type) }>
                <Text>Start or Increase Baclofen Dosage</Text>
              </CardItem>
            </Card>
          )
          break;
        case TrialTypes.decBaclofen:
          cards.push(
            <Card key={type}>
              <CardItem key={type} button onPress={ () => this.selectTrialType(type) } >
                <Text>Stop or Decrease Baclofen Dosage</Text>
              </CardItem>
            </Card>
          )
          break;
        case TrialTypes.none:
          break;
      }

    });

    return cards
  }

  _getTrialTypeButtons = (): Button[] => {
    // const trialTypeList = TrialTypes.
    // _.
    let types = _.values(TrialTypes);
    console.log(types);
    let buttons: Button[] = [];
    types.forEach( (type) => {

      console.log(type);

      switch(type) {
        case TrialTypes.incBaclofen: 
          buttons.push(
            <Button title="Start or Increase Baclofen Dosage" key={type}>
              <Text>Start or Increase Baclofen Dosage</Text>
            </Button>
          )
          break;
        case TrialTypes.decBaclofen:
          buttons.push(
            <Button key={type}>
              <Text>Stop or Decrease Baclofen Dosage</Text>
            </Button>
          )
          break;
        case TrialTypes.none:
          break;
      }

    });

    return buttons;
  }

  render() {
    const trialTypeCards = this._getTrialTypeCards();
    // const trialTypeButtons = this._getTrialTypeButtons();
    return (
      <Container>
        <Content>
          {/* <Header>
            <Text style={styles.header2}>Trial Type Selection Screen</Text>
          </Header> */}
          {/* {trialTypeList} */}
          {trialTypeCards}
          <Button title="Next" onPress={this.goToNext} />
        </Content>
      </Container>
    )
  }
}
