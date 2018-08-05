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
import type { TYTrial } from "../libs/intecojs/types";

export default class TrialList extends React.Component<any, any> {

  // prepareItem = (item: Object) => {
  //   return (
  //     <Text>{item.name}</Text>
  //   )
  // }

  // updateTrial = () => {
  //   console.log("updateTrial");
  // }

  _prepareCards = (items: TYTrial[]) => {
    const Cards: any = items.map( (item: TYTrial, index: number): any => { 
      return this._prepareACard(item);
    });
    return Cards;
    
  }

  _prepareACard = (item: TYTrial): any => {
    return (
      <Card key={item.tid}>
        <CardItem header>
          <Text>{item.name}</Text>
        </CardItem>
        <CardItem bordered>
          <Text> Follow these instructions. </Text>
          <Right>
            <Icon name="arrow-forward" button onPress={ () => this.props.goToUpdateTrial(item.tid)}/>
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