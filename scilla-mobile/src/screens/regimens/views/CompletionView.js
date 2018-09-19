// @flow
import React from "react";
import {
  View, StyleSheet, Image
} from "react-native";
import {
  
} from "native-base";
import {
  AppText
} from "../../../components";

type Props = {
  numStates: number, 
  currentStateIndex: number
}
export default class CompletionView extends React.Component<Props, any> {
  render() {
    return (
      <View>
        <Image source={require('../../../../assets/images/scilla-icon.png')}/>
      </View>
    )
  }
}