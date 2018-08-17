// @flow
import React from "react";
// import { Machine, State } from "xstate";
import { Action, State, withStateMachine } from "react-automata";
import { Icon, Text, Button, Container, Content } from 'native-base';
import { View, StyleSheet } from "react-native";

import type { NavigationNavigatorProps } from "react-navigation";
import type { RegimenType } from "../../libs/intecojs";
import { RegimenTypes } from "../../libs/intecojs";
import { Regimen, RegimenFactory } from "../../models/regimen";

import { ScreenNames } from "../../constants/Screens";
import styles from "./RegimenStyles"; 
// import { State } from "xstate";

//Views
import IntroView from "./views/IntroView";
import GoalSelectionView from "./views/GoalSelectionView";
import ParamSetupView from "./views/ParamSetupView";
import { DotPageIndicator } from "../../components";

export const StateNames = {
  main: "main",
  introduction: "introduction",
  goalSelection: "goalSelection",
  paramSetup: "paramSetup"
}
export const ActionNames = StateNames;

export const StateEvents = {
  NEXT: "NEXT",
  PREVIOUS: "PREVIOUS"
}

const NUM_INDICATOR_STATES = 8;
const mainViewStateMachineConfig = {
  initial: StateNames.introduction, 
  states: {
    [StateNames.main]: {
      onEntry: 'goToMain'
    },
    [StateNames.introduction]: {
      on: {
        [StateEvents.NEXT]: StateNames.goalSelection,
        [StateEvents.PREVIOUS]: StateNames.main
      },
      onEntry: ActionNames.introduction
    },
    [StateNames.goalSelection]: {
      on: {
        [StateEvents.NEXT]: {
          [StateNames.paramSetup]: {
            actions: ['initRegimen']
          }
        },
        [StateEvents.PREVIOUS]: StateNames.introduction
      },
      onEntry: ActionNames.goalSelection,
    },
    [StateNames.paramSetup]: {
      on: {
        [StateEvents.NEXT]: StateNames.paramSetup,
        [StateEvents.PREVIOUS]: StateNames.goalSelection
      },
      onEntry: ActionNames.paramSetup
    }
  }
}

class RegimenCreationScreens 
  extends React.Component<any, any>
{
  // machine: Machine = Machine(mainViewStateMachineConfig);
  state = {
    selectedRegimenType: RegimenTypes.incBaclofen
  }
  regimen: Regimen

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {}

  goToMain() {
    this.props.navigation.navigate(ScreenNames.RegimenMain);
  }

  goToPrevious = () => {
    this.props.transition(StateEvents.PREVIOUS);
  }

  goToNext = () => {
    this.props.transition(StateEvents.NEXT);
  }

  onGoalSelected = (regimenType: RegimenType) => {
    console.log(regimenType);
    this.setState({
      selectedRegimenType: regimenType
    })
  }

  verifyGoalSelection = (extState: State, event: Object) => {

  }

  initRegimen = () => {
    console.log('init regimen');
    this.regimen = RegimenFactory.createRegimen(this.state.selectedRegimenType);
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>

          <View style={styles.mainView}>
            <Action is={ActionNames.introduction}>
              <IntroView 
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={0}
              />
            </Action>
            <Action is={ActionNames.goalSelection}>
              <GoalSelectionView 
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={1}
                onGoalSelected={this.onGoalSelected}
                selectedRegimenType={this.state.selectedRegimenType}
              />
            </Action>
            <Action is={ActionNames.paramSetup}>
              <ParamSetupView
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={2}
              />
            </Action>
          </View>
            
          {/* <View style={styles.dotPageIndicator}>
            <DotPageIndicator 
              totalDots={7}
              currentDotIndex={0}
              dotColor='grey'
              activeDotColor='black'  
            />
          </View> */}

          <View style={styles.nextBackBtnView}>
            <Button iconLeft bordered={true} style={styles.button} onPress={this.goToPrevious}>
              <Icon name="arrow-back"/>
              <Text style={styles.textLeft}>Back</Text>
            </Button>
            <Button iconRight style={styles.button} onPress={this.goToNext}>
              <Text style={styles.textRight}>Next</Text>
              <Icon name="arrow-forward"/>
            </Button>
          </View>

        </Content>
      </Container>
    )
  }
}

export default withStateMachine(mainViewStateMachineConfig)(RegimenCreationScreens);