// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, AppText, DotPageIndicator
} from "../../../components";

type Props = {
  numStates: number, 
  currentStateIndex: number,
  regimenGoal: number
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
      case 0:
        text = "0";
        break;
      case 30:
        text = "30";
        break;
      case 60:
        text = "60";
        break;
      default:
        text = "Unknown";
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