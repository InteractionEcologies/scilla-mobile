// @flow
import React from "react";
import {
  Text,
  FlatList,
} from "react-native";

import {
  Container, List, ListItem, Body, Card,
  CardItem, Right, Icon
} from "native-base";
import type { RegimenObject } from "../../../libs/intecojs";
import _ from "lodash";

export default class RegimenList extends React.Component<any, any> {

  // prepareItem = (item: Object) => {
  //   return (
  //     <Text>{item.name}</Text>
  //   )
  // }

  // updateRegimen = () => {
  //   console.log("updateRegimen");
  // }

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

    // return (
    //   <List dataArray={this.props.items}
    //     renderRow={ (item) => (
    //       <ListItem>
    //         <Text>{item.name}</Text>
    //       </ListItem>
    //     )}
    //   >
    //   </List>
    // )
    return Cards;
    
  }
}