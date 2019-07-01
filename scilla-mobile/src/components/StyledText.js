// @flow
import React from 'react';
import { Text, Label } from "native-base"; 
import Fonts from "../constants/Fonts";

export class MonoText extends React.Component<any, any> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: Fonts.SpaceMono }]} />;
  }
}

export class AppText extends React.Component<any, any> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: Fonts.OpenSans }]} />;
  }
}

export class AppHeaderText extends React.Component<any, any> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: Fonts.OpenSans }]} />;
  }
}
