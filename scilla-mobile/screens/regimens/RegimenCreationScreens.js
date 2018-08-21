// @flow
import React from "react";
// import { Machine, State } from "xstate";
import { Action, State, withStateMachine } from "react-automata";
import { Icon, Text, Button, Container, Content } from 'native-base';
import { View, StyleSheet, Image } from "react-native";
import moment from "moment";

import type { NavigationNavigatorProps } from "react-navigation";
import type { 
  RegimenType,
  RegimenGoalOption,
  RegimenPhaseObject
} from "../../libs/intecojs";
import { 
  RegimenTypes, 
  RegimenGoalOptions,
  DateFormatISO8601
} from "../../libs/intecojs";
import { Regimen, RegimenFactory, IRegimenPhase } from "../../models/regimen";

import { ScreenNames } from "../../constants/Screens";
import styles from "./RegimenStyles"; 
// import { State } from "xstate";

//Views
import IntroView from "./views/IntroView";
import GoalSelectionView from "./views/GoalSelectionView";
import ParamSetupView from "./views/ParamSetupView";
import GoalSuggestionView from "./views/GoalSuggestionView";
import ScheduleView from "./views/ScheduleView";
import CompletionView from "./views/CompletionView";

import { DotPageIndicator, AppText } from "../../components";
import appService from "../../app/AppService";
import appState from "../../app/AppState";

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
        [StateEvents.NEXT]: {
          [StateNames.goalSuggestion]: {
            actions: ['setRegimenParam', 'generateRegimenGoal']
          }
        }
      },
      onEntry: ActionNames.paramSetup,
      onExit: '_enableNextStep'
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
        // TODO: Debugging purpose. 
        [StateEvents.NEXT]: StateNames.complete,
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
        [StateEvents.NEXT]: StateNames.main,
      },
      onEntry: ['finalizeRegimen', ActionNames.complete]
    },
  }
}

const WarningMessages = {
  noAvailableGoals: "We don't have any regimen associated with your current dosage.",
  dosageHighAlready: "Your current dosage reaches the maximum already, Scilla does"
   + " not have any dosage suggestion associated with your current dosage.",
  dosageCanNotBeNagative: "Your current dosage cannot be negative",
}

type States = {
  // regimen object state
  selectedRegimenType: RegimenType, 
  currentDoseMg: number,
  regimenGoal: RegimenGoalOption,
  startDate: ?string,
  regimenPhases: IRegimenPhase[],

  // ui 
  isNextBtnDisabled: bool,
  warningMessage: ?string,
}

class RegimenCreationScreens 
  extends React.Component<any, States>
{
  state = {
    selectedRegimenType: RegimenTypes.incBaclofen,
    currentDoseMg: 0,
    regimenGoal: RegimenGoalOptions.undefined,
    startDate: null,
    regimenPhases: [],

    isNextBtnDisabled: false,
    warningMessage: null
  }

  regimen: Regimen = RegimenFactory.createRegimen(RegimenTypes.incBaclofen)

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {

  }

  // MARK: - Regimen Creation Process
  initRegimen = () => {
    console.log('init regimen');
    this.regimen = RegimenFactory.createRegimen(this.state.selectedRegimenType);
    let user = appService.auth.currentUser;
    let uid = user.uid;
    this.regimen.setUserId(uid);

  }

  setRegimenParam = () => {
    console.log("setRegimenParam");

    this.regimen.setRegimenParam({
      currentDoseMg: this.state.currentDoseMg
    })
  }

  generateRegimenGoal = () => {
    this.regimen.generateRegimenGoal();
    this.setState({
      regimenGoal: this.regimen.regimenGoal
    })
  }

  generateTemporarySchedule = () => {
    let today: string = moment().format(DateFormatISO8601);
    this.regimen.setStartDate(today);
    this.regimen.make();
 
    this.setState({
      startDate: this.regimen.startDate,
      regimenPhases: this.regimen.getRegimenPhases()
    });
  }

  finalizeRegimen = () => {
    console.log("finalize regimen");
    this.regimen.make();
    appService.ds.createRegimen(this.regimen.toObj());

    appState.regimensById.set(this.regimen.id, this.regimen);
    appState.activeRegimenId = this.regimen.id;
    console.log(appState.regimensById);
  }

  // MARK: - UI event handlers
  onGoalSelected = (regimenType: RegimenType) => {
    console.log(regimenType);
    this.setState({
      selectedRegimenType: regimenType
    })
  }
  
  onCurrentDosageChanged = (newDoseMg: number) => {
    console.log(newDoseMg);
    this.setState({currentDoseMg: newDoseMg});
    this._verifyDosage(newDoseMg);
  }

  _verifyDosage = (newDoseMg: number) => {
    if (newDoseMg > 60) {
      this._disableNextStep(WarningMessages.dosageHighAlready);
    } else if (newDoseMg < 0) {
      this._disableNextStep(WarningMessages.dosageCanNotBeNagative);
    } else if (newDoseMg === 60) {
      if (this.regimen.type == RegimenTypes.incBaclofen) {
        this._disableNextStep(WarningMessages.dosageHighAlready);
      } else {
        this._enableNextStep();
      }
    } else {
      this._enableNextStep();
    } 
  }

  // MARK: - Navigation
  goToMain() {
    this.props.navigation.navigate(ScreenNames.RegimenMain);
  }

  goToPrevious = () => {
    this.props.transition(StateEvents.PREVIOUS);
  }

  goToNext = () => {
    this.props.transition(StateEvents.NEXT);
  }

  _disableNextStep = (warningMessage: string) => {
    this.setState({
      isNextBtnDisabled: true,
      warningMessage: warningMessage
    });
  }
  _enableNextStep = () => {
    this.setState({
      isNextBtnDisabled: false,
      warningMessage: null
    });
  }

  // MARK: - Rendering
  render() {
    return (
      <Content contentContainerStyle={styles.content}>
        {this._renderInnerView()}
        
        <View style={styles.nextBackBtnView}>
          <Button iconLeft bordered={true} style={styles.button} onPress={this.goToPrevious}>
            <Icon name="arrow-back"/>
            <AppText style={styles.textLeft}>Back</AppText>
          </Button>
          <Button 
            iconRight 
            style={styles.button} 
            onPress={this.goToNext} 
            disabled={this.state.isNextBtnDisabled}>
              <AppText style={styles.textRight}>Next</AppText>
              <Icon name="arrow-forward"/>
          </Button>
        </View>

      </Content>
    )
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
      <Action is={ActionNames.complete}>
        <CompletionView 
          numStates={NUM_INDICATOR_STATES}
          currentStateIndex={NUM_INDICATOR_STATES}
        />
      </Action>

      <View>
        <AppText style={styles.warningMessage}>
          {this.state.warningMessage}
        </AppText>
      </View>
    </View>
    )
  }

}

export default withStateMachine(mainViewStateMachineConfig)(RegimenCreationScreens);