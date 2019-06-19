// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import type { RegimenPhaseObject } from "../../../libs/intecojs";
import RegimenStyles from "../RegimenStyles";
import { Title, AppText, DotPageIndicator, RegimenSchedule } from "../../../components";
import { Regimen, IRegimenPhase } from "../../../libs/intecojs/models/regimen";

type Props = {
  numStates: number, 
  currentStateIndex: number, 
  regimenPhases: IRegimenPhase[]
}

export default class ScheduleView extends React.Component<Props, any> {
  componentDidMount() {}
  
  render() {
    return (
      <View>
        <Title>Medication Schedule</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
        />
        <AppText style={{marginBottom: 8}}>
          Scilla suggests you to walk through {this.props.regimenPhases.length} phases 
          of medication intake. Each phase typically lasts for a week.
        </AppText>
        <RegimenSchedule
          regimenPhases={this.props.regimenPhases}
        />
      </View>
    )
  }
}