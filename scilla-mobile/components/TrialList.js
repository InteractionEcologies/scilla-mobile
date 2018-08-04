// @flow
import React from "react";
import {
  Text,
  FlatList,
} from "react-native";

import {
  ListItem
} from "native-base";

export default class TrialList extends React.Component<any, any> {

  // prepareItem = (item: Object) => {
  //   return (
  //     <Text>{item.name}</Text>
  //   )
  // }

  render() {
    return (
      <FlatList 
        data={this.props.items}
        renderItem={ ({item}) => (
          // <ListItem> 
            <Text>{item.name}</Text>
          // <ListItem/>
        )}
        keyExtractor={(item, index) => (item.tid)}
      />
    )
  }
}