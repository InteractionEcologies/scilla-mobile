// @flow
import React from 'react';
import { Ionicons, Entypo } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component<any, any> {
  render() {
    return (
      <Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}