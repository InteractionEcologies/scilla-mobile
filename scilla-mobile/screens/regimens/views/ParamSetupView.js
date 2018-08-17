// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { Title, AppText, DotPageIndicator
} from "../../../components";
import RegimenStyles from "../RegimenStyles";
import { RegimenTypes } from "../../../libs/intecojs";
import type { RegimenType } from "../../../libs/intecojs";

type Props = {
  numStates: number, 
  currentStateIndex: number,
}


export default class ParamSetupView extends React.Component<Props, any> {

  render() {
    return (
      <View style={RegimenStyles.mainView}>
        <Title>What's Your Current Dosage?</Title>
        <DotPageIndicator 
          totalDots={7}
          currentDotIndex={2}
          dotColor='grey'
          activeDotColor='black'  
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 8
  }
})