// @flow
import React from "react";
import {
  View, Image
} from "react-native";

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