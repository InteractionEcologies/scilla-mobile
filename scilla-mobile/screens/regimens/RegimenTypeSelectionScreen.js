// @flow
import React from "react";
import { StyleSheet } from "react-native";
import {  Container, Content, Button, Text, List, 
  ListItem, Card, CardItem, Body, Header
} from "native-base";
import _ from "lodash";
import type { NavigationNavigatorProps } from "react-navigation";
import type { RegimenObject, RegimenType} from "../../libs/intecojs"

import styles from "./styles";
// import { RegimenMaker } from "../../models/RegimenMaker";
import { 
  RegimenMakerFactory, 
  RegimenMaker
} from "../../models/regimen";
import appService from "../../AppService";
import { RegimenTypes,  } from "../../libs/intecojs";
import { ScreenNames } from "../../constants/Screens";


export default class RegimenTypeSelectionScreen extends React.Component<NavigationNavigatorProps<any, any>, any> {
  state = {
    regimenType: null
  }
  static navigationOptions: any = {
    title: "Select Regimen"
  }
  regimenMaker: RegimenMaker;

  componentDidMount() {
    // this.regimenMaker = RegimenMakerFactory.create;
    // let uid = appService.auth.currentUser.uid;
    // this.regimenMaker.setUserId(uid);
  }

  goToNext = () => {
    // this.goToTypeOverviewScreen();
  }

  selectRegimenType = (type: RegimenType) => {
    console.log(`Select regimen type = ${type}`);
    this.regimenMaker = RegimenMakerFactory.createRegimen(type);
    console.log(`Current regimen type = ${this.regimenMaker._obj.type}`);
    this.props.navigation.navigate(ScreenNames.RegimenTypeOverview, { regimenMaker: this.regimenMaker });
  }

  _getRegimenTypeCards = (): List => {
    // const regimenTypeList = RegimenTypes.
    // _.
    let types = _.values(RegimenTypes);
    console.log(types);
    let cards: Card[] = [];
    types.forEach( (type) => {

      console.log(type);

      switch(type) {
        case RegimenTypes.incBaclofen: 
          cards.push(
            <Card key={type}>
              <CardItem key={type} button onPress={ () => this.selectRegimenType(type) }>
                <Text>Start or Increase Baclofen Dosage</Text>
              </CardItem>
            </Card>
          )
          break;
        case RegimenTypes.decBaclofen:
          cards.push(
            <Card key={type}>
              <CardItem key={type} button onPress={ () => this.selectRegimenType(type) } >
                <Text>Stop or Decrease Baclofen Dosage</Text>
              </CardItem>
            </Card>
          )
          break;
        case RegimenTypes.undefined:
          break;
      }
    });

    return cards
  }

  render() {
    const regimenTypeCards = this._getRegimenTypeCards();
    // const regimenTypeButtons = this._getRegimenTypeButtons();
    return (
      <Container>
        <Content>
          {regimenTypeCards}
        </Content>
      </Container>
    )
  }
}
