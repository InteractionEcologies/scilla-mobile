// @flow
import React, { Component } from "react";
import {
  Title,
  RegimenSchedule,
  DotPageIndicator
} from "../../../components"
import { View } from "native-base";
import { IRegimen } from "../../../libs/scijs"

type Props = {
  regimen: IRegimen,
  numStates: number,
  currentStateIndex: number
}

class RegimenIntroView extends Component<Props, any> {

  render() {
    const { regimen } = this.props;

    return (
      <View>
        <Title>Regimen Schedule</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          dotColor='grey'
          activeDotColor='black'  

          style={{marginBottom: 10}}
        />
        <RegimenSchedule
          regimenPhases={regimen.regimenPhases}
        />
      </View>
    )
  }
}

export default RegimenIntroView;