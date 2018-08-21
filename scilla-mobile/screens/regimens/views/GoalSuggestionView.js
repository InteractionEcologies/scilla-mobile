// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { Title, AppText, DotPageIndicator
} from "../../../components";
import RegimenStyles from "../RegimenStyles";
import { RegimenTypes, RegimenGoalOptions } from "../../../libs/intecojs";
import type { RegimenType, RegimenGoalOption } from "../../../libs/intecojs";

type Props = {
  numStates: number, 
  currentStateIndex: number,
  regimenGoal: RegimenGoalOption
}

export default class GoalSuggestionView extends React.Component<Props, any> {
  
  render() {  
    return (
      <View>
        {this._renderSuggestedDosage()}
        <AppText>
          We suggest you to gradually change to this amount of dosage. 
          See next page for detail instructions.
        </AppText>
      </View>
    )
  }

  _renderSuggestedDosage() {
    let text = "";
    switch(this.props.regimenGoal) {
      case RegimenGoalOptions.baclofen0mg:
        text = "0";
        break;
      case RegimenGoalOptions.baclofen30mg:
        text = "30";
        break;
      case RegimenGoalOptions.baclofen60mg:
        text = "60";
        break;
    }
    return (
      <View>
        <Title>Medication Suggestion</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          // dotColor='grey'
          // activeDotColor='black'  
        />
        <View style={styles.dosageView}>
          <Title style={styles.dosageText}>{text}</Title>
          <Title style={styles.dosageUnit}>mg /per day</Title>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dosageView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  dosageText: {
    fontSize: 50,
    // backgroundColor: 'blue'
    // textAlign: 'bottom'
  },
  dosageUnit: {
    height: 40,
    // backgroundColor: 'grey',
    // textAlign: 'bottom'
  }
});