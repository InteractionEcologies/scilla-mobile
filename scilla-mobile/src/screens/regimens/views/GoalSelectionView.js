// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { Title, AppText, DotPageIndicator
} from "../../../components";
import { RegimenTypes } from "../../../libs/scijs";
import type { RegimenType } from "../../../libs/scijs";

type Props = {
  numStates: number, 
  currentStateIndex: number,
  onGoalSelected: (regimenType: RegimenType) => void,
  selectedRegimenType: string
}

const btnTextMap = {
  [RegimenTypes.incBaclofen]: "Start or Increase Baclofen",
  [RegimenTypes.decBaclofen]: "Stop or Decrease Baclofen"
}

export default class GoalSelectionView extends React.Component<Props, any> {

  render() {
    return (
      <View>
        <Title>Choose Your Goal</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          dotColor='grey'
          activeDotColor='black'  
        />
        {this._renderButtonList()}
      </View>
    )
  }

  _renderButtonList = () => {
    let goals = [RegimenTypes.incBaclofen, RegimenTypes.decBaclofen];
    let buttons = [];

    for(let goal of goals) {
      let selected: boolean = goal === this.props.selectedRegimenType;
      buttons.push(
        <Button 
          key={goal}
          style={styles.button}
          bordered={!selected}
          block
          onPress={ () => this.props.onGoalSelected(goal)}
        >
          <AppText>{btnTextMap[goal]}</AppText>
        </Button>
      )
    }

    return (<View>{buttons}</View>);
  }

}

const styles = StyleSheet.create({
  button: {
    marginBottom: 8
  }
})