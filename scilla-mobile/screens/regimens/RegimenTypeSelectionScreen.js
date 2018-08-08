// @flow
import React from "react";
import { StyleSheet } from "react-native";
import {  Container, Content, Button, Text, List, 
  ListItem, Card, CardItem, Body, Header
} from "native-base";
import RegimenBaseScreen from "./RegimenBaseScreen";
import styles from "./styles";
import { RegimenMaker } from "../../libs/RegimenMaker";
import appService from "../../AppService";
import type { RegimenObject, RegimentOption} from "../../libs/intecojs/types"
import { RegimenOptions,  } from "../../libs/intecojs/types";
import _ from "lodash";
import { ScreenNames } from "../../constants/Screens";

export default class RegimenTypeSelectionScreen extends RegimenBaseScreen {
  state = {
    regimenType: null
  }
  static navigationOptions: any = {
    title: "Select Regimen"
  }
  regimenMaker: RegimenMaker;

  componentDidMount() {
    this.regimenMaker = new RegimenMaker();
    let uid = appService.auth.currentUser.uid;
    this.regimenMaker.setUserId(uid);
  }

  goToNext = () => {
    this.goToTypeOverviewScreen();
  }

  selectRegimenType = (type: RegimentOption) => {
    console.log(`Select regimen type = ${type}`);
    this.regimenMaker.setRegimenType(type);
    console.log(`Current regimen type = ${this.regimenMaker._data.type}`);
    this.navigate(ScreenNames.RegimenTypeOverview, { regimenMaker: this.regimenMaker });
  }

  _getRegimenTypeCards = (): List => {
    // const regimenTypeList = RegimenOptions.
    // _.
    let types = _.values(RegimenOptions);
    console.log(types);
    let cards: Card[] = [];
    types.forEach( (type) => {

      console.log(type);

      switch(type) {
        case RegimenOptions.incBaclofen: 
          cards.push(
            <Card key={type}>
              <CardItem key={type} button onPress={ () => this.selectRegimenType(type) }>
                <Text>Start or Increase Baclofen Dosage</Text>
              </CardItem>
            </Card>
          )
          break;
        case RegimenOptions.decBaclofen:
          cards.push(
            <Card key={type}>
              <CardItem key={type} button onPress={ () => this.selectRegimenType(type) } >
                <Text>Stop or Decrease Baclofen Dosage</Text>
              </CardItem>
            </Card>
          )
          break;
        case RegimenOptions.undefined:
          break;
      }

    });

    return cards
  }

  _getRegimenTypeButtons = (): Button[] => {
    // const regimenTypeList = RegimenOptions.
    // _.
    let types = _.values(RegimenOptions);
    console.log(types);
    let buttons: Button[] = [];
    types.forEach( (type) => {

      console.log(type);

      switch(type) {
        case RegimenOptions.incBaclofen: 
          buttons.push(
            <Button title="Start or Increase Baclofen Dosage" key={type}>
              <Text>Start or Increase Baclofen Dosage</Text>
            </Button>
          )
          break;
        case RegimenOptions.decBaclofen:
          buttons.push(
            <Button key={type}>
              <Text>Stop or Decrease Baclofen Dosage</Text>
            </Button>
          )
          break;
        case RegimenOptions.undefined:
          break;
      }

    });

    return buttons;
  }

  render() {
    const regimenTypeCards = this._getRegimenTypeCards();
    // const regimenTypeButtons = this._getRegimenTypeButtons();
    return (
      <Container>
        <Content>
          {/* <Header>
            <Text style={styles.header2}>Regimen Type Selection Screen</Text>
          </Header> */}
          {/* {regimenTypeList} */}
          {regimenTypeCards}
          <Button title="Next" onPress={this.goToNext} />
        </Content>
      </Container>
    )
  }
}
