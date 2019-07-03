// @flow
import React, { Component, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { AppText, AppHeaderText } from "./StyledText";
import { ThreePillTableHeader, ThreePillTableRow } from "./ThreePillTable";
import { AntDesign } from "@expo/vector-icons";
import { Button } from "native-base";
import type { IRegimenPhase } from "../libs/scijs";
import RegimenPhaseViewModel from "../viewModels/RegimenPhaseViewModel";

type Props = {
  prevPhase: ?IRegimenPhase,
  nextPhase: ?IRegimenPhase
}

export default class RegimenPhaseTransitionBriefing extends Component<Props, any> {

  render() {
    const { prevPhase, nextPhase } = this.props;
    let prevTreatmentValues = [" ", " ", " "];
    if(prevPhase) {
      const prevPhaseVM = new RegimenPhaseViewModel(prevPhase);
      prevTreatmentValues = prevPhaseVM.getThreePillTableViewValues();
    }
    
    let nextTreatmentValues = [" ", " ", " "];
    if(nextPhase) {
      const nextPhaseVM = new RegimenPhaseViewModel(nextPhase);
      nextTreatmentValues = nextPhaseVM.getThreePillTableViewValues();
    }

    return (
      <View style={styles.main}
      >
        <ThreePillTableHeader
          columns={["Morning", "Afternoon", "Evening"]}
          style={styles.header}
        />
        {!!prevPhase &&
          <Fragment>
            <ThreePillTableRow 
              values={prevTreatmentValues}
              style={styles.row}
            />
            <AntDesign name="caretdown" size={30}/>
          </Fragment>
        }
        <ThreePillTableRow 
          values={nextTreatmentValues}
          style={styles.row}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    width: '90%', 
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: 'center', 
  },
  header: {
    marginTop: 20
  },
  row: {
    // backgroundColor: 'red'
  },
  buttonsView: {
    flex: 1,
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20
  },
  button: {
    width: 150, 
    justifyContent: 'center'
  }
    
})