// @flow
import React from 'react';
import { View } from "react-native";
import type { ComplianceReportObject } from '../../../libs/scijs';
import { Treatment } from "../../../libs/scijs/models/regimen";
import ComplianceReportCard from "./ComplianceReportCard";
import _ from "lodash";

type Props = {
  treatmentMap: {[treatmentId: string]: Treatment}, // key: id of treatment
  complianceReportMap: {[treatmentId: string]: ComplianceReportObject}, // key: id of treatment
  onTreatmentSkipped: (treatmentId: string) => void,
  onTreatmentCompiled: (treatmentId: string) => void,
  onTreatmentSnoozed: (treatmentId: string) => void
}

export default class TreatmentListView extends React.Component<Props, any> {
  render() {
    return (
      <View>
        {this.renderComplianceReportCards()}
      </View>
    )
  }

  renderComplianceReportCards() {
    let cards = [];
    _.map(this.props.complianceReportMap, (report, key) => {
      let treatment = _.get(this.props.treatmentMap, key);
      if(treatment) {
        cards.push(<ComplianceReportCard
            key={report.id}
            treatment={treatment}
            report={report}
            onTreatmentSkipped={this.props.onTreatmentSkipped}
            onTreatmentComplied={this.props.onTreatmentCompiled}
            onTreatmentSnoozed={this.props.onTreatmentSnoozed}
          />
        )
      }
    })
    return cards;
  }
}

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 8,
//   },
//   cardItem: {
//     justifyContent: 'center'
//   },
//   buttonRow: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: "center",
//     alignItems: 'center',
//     height: 60
//   },
//   button: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     height: 55
//   },
//   icon: {
//     fontSize: 40
//     // height: 
//   }
// })