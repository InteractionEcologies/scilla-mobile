// @flow
import React, { Component } from "react";
import {
  AppText,
  Title,
  RegimenSchedule
} from "../../../components"
import { View } from "native-base";
import { Regimen } from "../../../libs/scijs"

type Props = {
  regimen: Regimen
}

class RegimenIntroView extends Component<Props, any> {

  render() {
    const { regimen } = this.props;

    return (
      <View>
        <Title>Regimen Schedule</Title>
        <RegimenSchedule
          regimenPhases={regimen.regimenPhases}
        />
      </View>
    )
  }
}

export default RegimenIntroView;