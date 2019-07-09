// @flow
import React from 'react';
import { View } from "react-native";
import type { ComplianceReportObject } from '../../../libs/scijs';
import { Treatment } from "../../../libs/scijs/models/regimen";
import ComplianceReportCard from "./ComplianceReportCard";
import _ from "lodash";

type Props = {
  treatmentMap: {[treatmentId: string]: Treatment}, // key: id of treatment

  // If complianceReportMap is empty (i.e., {}), will only render 
  // a "disabled" version of cards. 
  complianceReportMap: {[treatmentId: string]: ComplianceReportObject}, // key: id of treatment
  
  onTreatmentSkipped: (treatmentId: string) => void,
  onTreatmentCompiled: (treatmentId: string) => void,
  onTreatmentSnoozed: (treatmentId: string) => void
}

const SCOPE = "TreatmentListView:";
export default class TreatmentListView extends React.Component<Props, any> {

  render() {

    const { complianceReportMap, treatmentMap } = this.props;
    const length = Object.keys(complianceReportMap).length;
    // console.log(SCOPE, "number of compliance reports", length);
    return (
      <View>
        {length > 0 &&
          this.renderComplianceReportCards()
        }
        {length === 0 &&
          this.renderDisabledComplianceReportCards()
        }        
      </View>
    )
  }

  renderDisabledComplianceReportCards() {
    const { complianceReportMap, treatmentMap } = this.props;
    let cards = []
    _.map(treatmentMap, (treatment: Treatment, key: string) => {
      cards.push(<ComplianceReportCard
        key={treatment.id}
        treatment={treatment}
        disabled={true}
        onTreatmentSkipped={this.props.onTreatmentSkipped}
        onTreatmentComplied={this.props.onTreatmentCompiled}
        onTreatmentSnoozed={this.props.onTreatmentSnoozed}
      />)
    }) 
    return cards;
  }

  renderComplianceReportCards() {
    const { complianceReportMap, treatmentMap } = this.props;
    let cards = [];
    
    _.map(treatmentMap, (treatment: Treatment, key: string) => {
      let report = _.get(complianceReportMap, key);
      if(report) {
        cards.push(<ComplianceReportCard
          key={report.id}
          treatment={treatment}
          report={report}
          disabled={false}
          onTreatmentSkipped={this.props.onTreatmentSkipped}
          onTreatmentComplied={this.props.onTreatmentCompiled}
          onTreatmentSnoozed={this.props.onTreatmentSnoozed}
        />)  
      }
    });

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