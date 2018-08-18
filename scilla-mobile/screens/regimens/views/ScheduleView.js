// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import type { RegimenPhaseObject } from "../../../libs/intecojs";
import RegimenStyles from "../RegimenStyles";
import { Title, AppText, DotPageIndicator, RegimenSchedule } from "../../../components";
import { Regimen } from "../../../models/regimen";

type Props = {
  numStates: number, 
  currentStateIndex: number, 
  regimenPhases: RegimenPhaseObject[]
}

export default class ScheduleView extends React.Component<Props, any> {
  componentDidMount() {

  }
  render() {
    return (
      <View style={RegimenStyles.mainView}>
        <Title>Regimen Schedule</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          currentDotIndex={this.props.currentStateIndex}
        />
        <RegimenSchedule 
          regimenPhases={this.props.regimenPhases}
        />
      </View>
    )
  }
}