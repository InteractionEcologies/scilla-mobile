// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./";
import type { TreatmentObject, RegimenPhaseObject } from "../libs/intecojs";

import _ from "lodash";
import moment from "moment";
import { TreatmentDetailOptions } from "../libs/intecojs";
import { RegimenUtils } from "../models/regimen";

type Props = {
  regimenPhases: RegimenPhaseObject[]
}

export class RegimenSchedule extends React.Component<Props, any> {
  componentDidMount() {
    console.log("RegimenSchedule")  
  }

  renderRows() {
    let rows = [];
    // Make sure treatment is sorted.
    let regimenPhases = _.sortBy(
      this.props.regimenPhases, 
      (phaseObj) => { return phaseObj.phase}
    )

    for(let phaseObj of regimenPhases) {
      let phaseNumber = phaseObj.phase
      let treatments: TreatmentObject[] = phaseObj.treatments;

      treatments = RegimenUtils.sortTreatments(treatments);

      let valuesForPillTableRow: string[] = [" ", " ", " "];
      
      for(let treatment of treatments) {
        switch(treatment.option) {
          case TreatmentDetailOptions.baclofen5mg: 
            valuesForPillTableRow.push("5 mg");
            break;
          case TreatmentDetailOptions.baclofen10mg:
            valuesForPillTableRow.push("10 mg");
            break;
          case TreatmentDetailOptions.baclofen15mg:
            valuesForPillTableRow.push("15 mg");
            break;
          case TreatmentDetailOptions.baclofen20mg:
            valuesForPillTableRow.push("20 mg");
            break;
        }
      }
      
      console.log(valuesForPillTableRow);
      rows.push(<ThreePillTableRow key={phaseNumber}
        rowIndex={phaseNumber}
        values={valuesForPillTableRow}
      />)
    }

    return rows;

  }

  render() {
    console.log(this.props.regimenPhases);

    return (
      <View>
        <ThreePillTableHeader 
          columns={["Phase", "Morning", "Afternoon", "Evening"]}
        />
        {this.renderRows()}
      </View>
    )
  }
}



type ThreePillTableHeaderProps = {
  columns: string[]
}

class ThreePillTableHeader extends React.Component<any, any> {
  render() {
    let columns = [];
    for(let i=0; i < this.props.columns.length; i++) {
      if(i >= 4) break;
      columns.push(<AppText key={i}>{this.props.columns[i]}</AppText>);
    }
    return (<View style={styles.headerRow}>{columns}</View>);
  }
}



type ThreePillTableRowProps = {
  rowIndex: number, 
  values: string[]
}

class ThreePillTableRow extends React.Component<any, any> {
  _renderPillRegions = () => {
    let pills = [];

    for(let i = 0; i < 3; i++) {
      let text = this.props.values[i] ? this.props.values[i] : '';
      pills.push(
        <PillRegion key={i}>
          <AppText style={styles.pillText}>text</AppText>
        </PillRegion>)
    }
    return pills;
  }

  _renderBackgroundLine = () => {
    return (
      <View style={styles.lineOverlayRegion}>
        <View style={styles.line}></View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.phaseRow}>
          
        <View style={styles.phaseTextRegion}>
          <AppText>{this.props.rowIndex+1}</AppText>
        </View>

        <View style={styles.pillGroupRegion}>
          {this._renderBackgroundLine()}
          {this._renderPillRegions()}
        </View>

      </View>
    )
  }
}



class PillRegion extends React.Component<any, any> {
  render() {
    return <View style={styles.pillRegion}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 8,
  },
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  phaseTextRegion: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 20,
    // height: 30,
    backgroundColor: 'blue',
  },
  pillGroupRegion: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'yellow'
  },
  pillRegion: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'grey'
  },
  pillText: {
    color: 'white',
    fontSize: 14
  },
  lineOverlayRegion: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  line: {
    backgroundColor: 'grey',
    width: 200,
    height: 2
  }
});