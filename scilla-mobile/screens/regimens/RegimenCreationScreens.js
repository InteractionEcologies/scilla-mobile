// @flow
import React from "react";
// import { Machine, State } from "xstate";
import { Action, State, withStateMachine } from "react-automata";
import { Icon, Text, Button, Container, Content } from 'native-base';
import { View, StyleSheet } from "react-native";
import moment from "moment";

import type { NavigationNavigatorProps } from "react-navigation";
import type { RegimenType } from "../../libs/intecojs";
import { RegimenTypes, RegimenGoalOption, DateFormatISO8601, RegimenPhaseObject } from "../../libs/intecojs";
import { Regimen, RegimenFactory } from "../../models/regimen";

import { ScreenNames } from "../../constants/Screens";
import styles from "./RegimenStyles"; 
// import { State } from "xstate";

//Views
import IntroView from "./views/IntroView";
import GoalSelectionView from "./views/GoalSelectionView";
import ParamSetupView from "./views/ParamSetupView";
import GoalSuggestionView from "./views/GoalSuggestionView";
import ScheduleView from "./views/ScheduleView";

import { DotPageIndicator } from "../../components";
import appService from "../../AppService";

const NUM_INDICATOR_STATES = 9;
const StateNames = {
  main: "main",
  introduction: "introduction",
  goalSelection: "goalSelection",
  paramSetup: "paramSetup",
  goalSuggestion: "goalSuggestion",
  schedule: "schedule",
  dateSelection: 'dateSelection',
  reminderConfig: 'reminderConfig',
  trackedMeasurementTypeConfig: 'trackedMeasurementTypeConfig',
  precautions: 'precautions',
  complete: 'complete'
}
const ActionNames = StateNames;
const StateEvents = {
  NEXT: "NEXT",
  PREVIOUS: "PREVIOUS"
}

const mainViewStateMachineConfig = {
  initial: StateNames.introduction, 
  states: {
    [StateNames.main]: {
      onEntry: 'goToMain'
    },
    [StateNames.introduction]: {
      on: {
        [StateEvents.PREVIOUS]: StateNames.main,
        [StateEvents.NEXT]: StateNames.goalSelection,
      },
      onEntry: ActionNames.introduction
    },
    [StateNames.goalSelection]: {
      on: {
        [StateEvents.PREVIOUS]: StateNames.introduction,
        [StateEvents.NEXT]: {
          [StateNames.paramSetup]: {
            actions: ['initRegimen']
          }
        },
      },
      onEntry: ActionNames.goalSelection,
    },
    [StateNames.paramSetup]: {
      on: {
        [StateEvents.PREVIOUS]: StateNames.goalSelection,
        [StateEvents.NEXT]: StateNames.goalSuggestion,
      },
      onEntry: ActionNames.paramSetup,
      onExit: 'setRegimenParam'
    },
    [StateNames.goalSuggestion]: {
      on: {
        [StateEvents.PREVIOUS]: StateNames.paramSetup,
        [StateEvents.NEXT]: StateNames.schedule,
      },
      onEntry: ActionNames.goalSuggestion
      
    },
    [StateNames.schedule]: {
      on: {
        [StateEvents.PREVIOUS]: StateNames.goalSuggestion,
        [StateEvents.NEXT]: StateNames.dateSelection,
      },
      onEntry: ['generateTemporarySchedule', ActionNames.schedule]
    },
    [StateNames.dateSelection]: {
      on: {
        [StateEvents.PREVIOUS]: StateNames.schedule,
        [StateEvents.NEXT]: StateNames.reminderConfig,
      },
      onEntry: ActionNames.dateSelection
    },
    [StateNames.reminderConfig]: {
      on: {

        [StateEvents.PREVIOUS]: StateNames.dateSelection,
        [StateEvents.NEXT]: StateNames.trackedMeasurementTypeConfig,
      },
      onEntry: ActionNames.reminderConfig
    },
    [StateNames.trackedMeasurementTypeConfig]: {
      on: {
        [StateEvents.PREVIOUS]: StateNames.precautions,
        [StateEvents.NEXT]: StateNames.complete,
      },
      onEntry: ActionNames.trackedMeasurementTypeConfig
    },
    [StateNames.complete]: {
      on: {
        [StateEvents.NEXT]: StateNames.complete,
      },
      onEntry: ActionNames.complete
    },
  }
}

type States = {
  selectedRegimenType: RegimenType, 
  currentDoseMg: number,
  regimenGoal: RegimenGoalOption,
  regimenPhases: RegimenPhaseObject[],

  regimen: Regimen
}

class RegimenCreationScreens 
  extends React.Component<any, States>
{
  // machine: Machine = Machine(mainViewStateMachineConfig);
  state = {
    selectedRegimenType: RegimenTypes.incBaclofen,
    currentDoseMg: 0,
    regimenGoal: null,
    regimenPhases: [],
    regimen: RegimenFactory.createRegimen(RegimenTypes.incBaclofen)
  }

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

  onCurrentDosageChanged = (newDoseMg: number) => {
    console.log(newDoseMg);
    this.setState({
      currentDoseMg: newDoseMg
    })
  }

  initRegimen = () => {
    console.log('init regimen');
    this.setState({
      regimen: RegimenFactory.createRegimen(this.state.selectedRegimenType)
    });

    let user = appService.auth.currentUser;
    let uid = user.uid;
    this.state.regimen.setUserId(uid);
  }

  setRegimenParam = () => {
    console.log("setRegimenParam");

    // Generate personalized goal to use 
    // in the next page.
    this._generateRegimenGoal();
    this._setStateOfRegimenGoal();
  }

  _generateRegimenGoal = () => {
    this.state.regimen.setRegimenParam({
      currentDoseMg: this.state.currentDoseMg
    })
    this.state.regimen.confirmRegimenParam();
  }

  _setStateOfRegimenGoal = () => {
    this.setState({
      regimenGoal: this.state.regimen.regimenGoal
    })
  }

  generateTemporarySchedule = () => {
    let today: string = moment().format(DateFormatISO8601);
    this.state.regimen.setStartDate(today);
    this.state.regimen.make();

    this.setState({
      regimenPhases: this.state.regimen.getRegimenPhases()
    });
  }

  _renderInnerView = () => {
    return (
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
          currentDoseMg={this.state.currentDoseMg}
          onCurrentDosageChanged={this.onCurrentDosageChanged}
        />
      </Action>
      <Action is={ActionNames.goalSuggestion}>
        <GoalSuggestionView
          numStates={NUM_INDICATOR_STATES} 
          currentStateIndex={3}
          regimenGoal={this.state.regimenGoal}
        />
      </Action>
      <Action is={ActionNames.schedule}>
        <ScheduleView
          numStates={NUM_INDICATOR_STATES}
          currentStateIndex={4}
          regimenPhases={this.state.regimenPhases}
        />
      </Action>
      <Action is={ActionNames.dateSelection}></Action>
      <Action is={ActionNames.reminderConfig}></Action>
      <Action is={ActionNames.trackedMeasurementTypeConfig}></Action>
      <Action is={ActionNames.precautions}></Action>
      <Action is={ActionNames.complete}></Action>
    </View>
    )
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          {this._renderInnerView()}

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