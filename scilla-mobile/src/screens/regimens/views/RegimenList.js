// @flow
import React from "react";
import {
  Text,
} from "react-native";

import {
  Card,
  CardItem, Right, Icon
} from "native-base";
import type { RegimenObject } from "../../../libs/scijs";
import _ from "lodash";

export default class RegimenList extends React.Component<any, any> {

  _prepareCards = (items: RegimenObject[]) => {
    const Cards: any = _.map(items, (item: RegimenObject, index: number): any => { 
      return this._prepareACard(item);
    });
    return Cards;
    
  }

  _prepareACard = (item: RegimenObject): any => {
    return (
      <Card key={item.id}>
        <CardItem header>
          <Text>{item.name}</Text>
        </CardItem>
        <CardItem bordered>
          <Text> Follow these instructions. </Text>
          <Right>
            <Icon name="arrow-forward" button onPress={ () => this.props.goToUpdateRegimen(item.id)}/>
          </Right>
        </CardItem>
      </Card>
    )
  }

  render() {
    const Cards = this._prepareCards(this.props.items);
    return Cards;
    
  }
}