import React from 'react';
// import { Text } from 'react-native';
import { Text, Label } from "native-base"; 
import Fonts from "../constants/Fonts";

const FONT_FAMILY = "space-mono";

export class MonoText extends React.Component<any, any> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: FONT_FAMILY }]} />;
  }
}

export class AppText extends React.Component<any, any> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: Fonts.OpenSans }]} />;
  }
}

export class AppHeaderText extends React.Component<any, any> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: Fonts.SpaceMonoBold }]} />;
  }
}
