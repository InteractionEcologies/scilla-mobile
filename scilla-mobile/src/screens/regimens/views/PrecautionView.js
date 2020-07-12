// @flow
import React, { Component } from "react"; 
import { Title, AppText, DotPageIndicator } from "../../../components";
import { View } from "native-base";

type Props = {
  numStates: number, 
  currentStateIndex: number
}

class PrecautionView extends Component<Props, any> {

  render() {
    return (
      <View>
        <Title>Precautions</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          style={{marginBottom: 10}}
        />
        <View style={{alignItems: "flex-start"}}>
          <AppText>• Do not stop your medication abruptly.</AppText> 
          <AppText>• Contact your doctor if you have any questions.</AppText> 
        </View>
      </View>
    );
  }
}

export default PrecautionView;