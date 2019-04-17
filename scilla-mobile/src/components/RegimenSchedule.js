// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText, AppHeaderText } from "./StyledText";

import _ from "lodash";
import moment from "moment";

import type { TreatmentObject, RegimenPhaseObject } from "../libs/intecojs";
import { TreatmentDetailOptions } from "../libs/intecojs";
import { RegimenUtils, IRegimenPhase, Treatment, PartOfDayOptions } from "../models/regimen";

type Props = {
  regimenPhases: IRegimenPhase[],
  style?: any
}

export class RegimenSchedule extends React.Component<Props, any> {
  componentDidMount() {
    console.log("RegimenSchedule")  
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
      
      rows.push(<ThreePillTableRow key={phaseNumber}
        rowIndex={phaseNumber}
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

type ThreePillTableHeaderProps = {
  columns: string[]
}

class ThreePillTableHeader extends React.Component<any, any> {
  render() {
    let columns = [];
    for(let i=0; i < this.props.columns.length; i++) {
      if(i >= 4) break;
      columns.push(
        <AppHeaderText key={i} style={styles.headerText}>
          {this.props.columns[i]}
        </AppHeaderText>
      );
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
      if(text === "" || text === " ") {
        pills.push(
          <PillRegion key={i} empty>
            <AppText style={styles.pillText}>{text}</AppText>
          </PillRegion>)
      } else {
        pills.push(
          <PillRegion key={i}>
            <AppText style={styles.pillText}>{text}</AppText>
          </PillRegion>)
      }
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
    return (
      <View style={this.props.empty ? styles.emptyPillRegion : styles.pillRegion}>
        {this.props.children}
      </View>
    );
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
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  phaseTextRegion: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 20,
    // height: 30,
    // backgroundColor: 'blue',
  },
  pillGroupRegion: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },
  pillRegion: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'grey'
  },
  emptyPillRegion: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.0)'
  },
  headerText: {
    fontSize: 12,
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