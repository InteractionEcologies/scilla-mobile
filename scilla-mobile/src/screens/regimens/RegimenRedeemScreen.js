// @flow
import React, { Component } from "react";
import { Action, withStateMachine } from "react-automata";

import type { DateTypeISO8601, Regimen } from "../../libs/scijs";

import { RegimenFactory, RegimenStatusOptions } from "../../libs/scijs";
import AppState from "../../app/AppState";
import AppService from "../../app/AppService";

import styles from "./RegimenStyles";
import Colors from "../../constants/Colors";

import { StyleSheet } from "react-native";
import { AppText } from "../../components";
import { View, Button, Card, CardItem, Content } from "native-base";

import InputCodeView from "./views/InputCodeView";
import ConfirmRegimenView from "./views/ConfirmRegimenView";
import RegimenIntroView from "./views/RegimenIntroView";
import SelectDateView from "./views/SelectDateView";

// This is a singleton. 
const appService = AppService.instance;
const appState = AppState.instance;

const StateNames = {
  inputCode: 'inputCode',
  confirmRegimen: 'confirmRegimen',
  schedule: 'schedule',
  selectDate: 'selectDate',
  setupReminders: 'setupReminders',
  selectMeasurements: 'selectMeasurements',
  precaution: 'precaution',
  completion: 'completion',
  main: 'main' // back to RegimenMainScreen
}

const StateEvents = {
  NEXT: "NEXT",
  PREVIOUS: "PREVIOUS"
}

const StateMachine = {
  initial: StateNames.inputCode,
  states: {
    [StateNames.inputCode]: {
      onEntry: StateNames.inputCode
    },
    [StateNames.confirmRegimen]: {
      onEntry: StateNames.confirmRegimen,
      on: {
        [StateEvents.PREVIOUS]: StateNames.inputCode,
        [StateEvents.NEXT]: StateNames.schedule
      },
    },
    [StateNames.schedule]: {
      onEntry: StateNames.schedule,
      on: {
        // Once confirmed can't go back. 
        [StateEvents.NEXT]: StateNames.selectDate
      },
    },
    [StateNames.selectDate]: {
      onEntry: StateNames.selectDate,
      on: {
        [StateEvents.PREVIOUS]: StateNames.schedule,
        [StateEvents.NEXT]: StateNames.setupReminders
      },
    },
    [StateNames.setupReminders]: {
      onEntry: StateNames.setupReminders,
      on: {
        [StateEvents.PREVIOUS]: StateNames.selectDate,
        [StateEvents.NEXT]: StateNames.selectMeasurements
      },
    },
    [StateNames.selectMeasurements]: {
      onEntry: StateNames.selectMeasurements,
      on: {
        [StateEvents.PREVIOUS]: StateNames.setupReminders,
        [StateEvents.NEXT]: StateNames.precaution
      },
    },
    [StateNames.precaution]: {
      onEntry: StateNames.precaution,
      on: {
        [StateEvents.PREVIOUS]: StateNames.selectMeasurements,
        [StateEvents.NEXT]: StateNames.completion
      },
    },
    [StateNames.completion]: {
      onEntry: StateNames.completion,
      on: {
        [StateEvents.PREVIOUS]: StateNames.precaution,
        [StateEvents.NEXT]: StateNames.main
      },
    },
    [StateNames.main]: {
      onEntry: 'goToMain'
    }
  }
}

const customStyles = StyleSheet.create({
  content: {
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'red',
  },
  card: {
    marginLeft: 10, 
    marginRight: 10,
  },
  cardItem: {
    width: '100%',
    flexDirection: "column",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor
  }
});

type State = {
  regimen: ?Regimen,
  errorMsg: string
}

const initialState = {
  regimen: null,
  errorMsg: ''
}

class RegimenRedeemScreen extends Component<any, State> {

  constructor(props) {
    super(props);

    this.state = initialState;
  }

  goToPrevious = () => {
    console.log("goToPrevious");
    this.props.transition(StateEvents.PREVIOUS);
  }

  goToNext = () => {
    console.log("goToNext");
    this.props.transition(StateEvents.NEXT);
  }
  
  redeemRegimen = async (code: string) => {
    // Will set errorMsg. 
    try {
      let regimenObj = await appService.ds.getRegimenByCode(code)
      let regimen = RegimenFactory.createRegimenFromObj(regimenObj);
      this.setState({regimen: regimen});

    } catch (e) {
      if (e.name === 'NotExistError') {
        this.setState({errorMsg: "Invalid Redeem Code"});
      } else if (e.name === "DuplicateRegimenError")  {
        this.setState(
          {
            errorMsg: "There is a problem with this code." +
              "Please contact the research team."
          })
      }
    }
  }

  confirmRegimen = async () => {
    // Set the regimen's uid to be the current user. 
    // Change the state of the regimen from notRedeemed to active. 
    let { regimen } = this.state;
    
    if(regimen) {
      // let user = appService.auth.currentUser;
      let userProfile = await appState.getUserProfile();
      regimen.setUserId(userProfile.uid);
      regimen.setStatus(RegimenStatusOptions.active);

      // Save
      appService.ds.upsertRegimen(regimen.toObj());

      // Move to the next step.       
    }
  }

  
  /** Update the start date of a regimen. 
   * @param  {DateTypeISO8601} startDate
   */
  setRegimenStartDate = (startDate: DateTypeISO8601) => {

  }

  setReminders = () => {
    // regimen.setReminderConfig(reminderId: string, newConfig: ReminderConfigObject)
    // regimen.setReminderTime(reminderId: string, time: string)
  }

  toggleReminder = (reminderId: string) => {

  }

  getReminderConfigs = (regimen: Regimen) => {
    let configs = regimen.reminderConfigs;

  }

  render() {
    const { regimen, errorMsg } = this.state;

    return (
      <Content>
        <Card style={customStyles.card}>
          <CardItem style={customStyles.cardItem}>
            <Action is={StateNames.inputCode}>
              <InputCodeView 
                onRedeemed={this.redeemRegimen}
                errorMsg = {errorMsg}

              />
            </Action>
            <Action is={StateNames.confirmRegimen}>
              <ConfirmRegimenView />
            </Action>
            <Action is={StateNames.schedule}>
              <RegimenIntroView />
            </Action>
            <Action is={StateNames.selectDate}>
              <SelectDateView />
            </Action>
          </CardItem>
        </Card>

        <View>
          <Button 
            iconLeft 
            bordered={true}
            onPress={this.goToPrevious}>
            <AppText>
            Back
            </AppText>
          </Button>
          <Button
            iconRight
            bordered={true}
            onPress={this.goToNext}>
            <AppText>Next</AppText>
          </Button>
        </View>
      </Content>
    )
  }
}

export default withStateMachine(StateMachine)(RegimenRedeemScreen);