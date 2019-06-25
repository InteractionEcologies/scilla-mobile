// @flow
import React, { Fragment} from "react";
import {
  View, Image, Platform
} from "react-native";
import {
  AppText
} from "../../../components";
import {Ionicons} from "@expo/vector-icons";

type Props = {
  numStates: number, 
  currentStateIndex: number
}
export default class CompletionView extends React.Component<Props, any> {
  render() {
    return (
      <Fragment>
        {/* <Image source={require('../../../../assets/images/scilla-icon.png')}/> */}
        <Ionicons
          name={Platform === "ios" 
            ? "ios-checkmark-circle"
            : "md-checkmark-circle"
          }
          size={120}
        ></Ionicons>
        <AppText>Your regimen is created.</AppText>
      </Fragment>
    )
  }
}