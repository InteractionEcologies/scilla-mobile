// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText, AppHeaderText } from "./StyledText";

import { RegimenUtils, IRegimenPhase, PartOfDayOptions } from "../libs/scijs";
import { ThreePillTableHeader, ThreePillTableRow } from "./ThreePillTable";

type Props = {
  regimenPhases: IRegimenPhase[],
  showDates?: boolean,
  highlightedPhaseOrder?: ?number,
  style?: any
}

const SCOPE = "RegimenSchedule:"
export class RegimenSchedule extends React.Component<Props, any> {
  componentDidMount() {
  }

  renderRows() {
    let rows = [];
    // Make sure treatment is sorted.
    let regimenPhases = this.props.regimenPhases;

    for(let regimenPhase of regimenPhases) {
      let phaseNumber = regimenPhase.phase
      let valuesForPillTableRow: string[] = [" ", " ", " "];

      let treatmentsByPartOfDayObject = regimenPhase.getTreatmentsByPartOfDay();

      let podOptions = [
        PartOfDayOptions.morning, 
        PartOfDayOptions.afternoon, 
        PartOfDayOptions.evening
      ]
      for(let podOption of podOptions) {
       let treatments = treatmentsByPartOfDayObject[podOption];
       let oneTreatment = treatments ? treatments[0]: null;

       let arrayIndex = RegimenUtils.partOfDay2ArrayIndex(podOption);
        valuesForPillTableRow[arrayIndex] = 
          oneTreatment 
          ? oneTreatment.getShortDescription()
          : " ";
      }
      
      const startDateStr = regimenPhase.startDate.format("M/D");
      const endDateStr = regimenPhase.endDate.format("M/D");
      const periodStr = `${startDateStr} - ${endDateStr}`;
      
      let isHighlighted = regimenPhase.phase === this.props.highlightedPhaseOrder;
      rows.push(<ThreePillTableRow key={phaseNumber}
        rowIndex={phaseNumber}
        rowDesc={this.props.showDates ? periodStr : null}
        highlighted={isHighlighted}
        values={valuesForPillTableRow}
      />)
    }

    return rows;

  }

  render() {
    return (
      <View style={this.props.style}>
        <ThreePillTableHeader 
          columns={["Phase", "Morning", "Afternoon", "Evening"]}
        />
        {this.renderRows()}
      </View>
    )
  }
}