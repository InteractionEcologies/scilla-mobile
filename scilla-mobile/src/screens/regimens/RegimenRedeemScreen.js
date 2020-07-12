// @flow
import React, { Component } from "react";
import { Action, withStateMachine } from "react-automata";

import type { DateTypeISO8601, IRegimen, RegimenObject,
  ReminderConfigObject
} from "../../libs/scijs";

import { RegimenFactory, RegimenStatusOptions } from "../../libs/scijs";
import AppStore from "../../services/AppStore";
import AppService from "../../services/AppService";

// import styles from "./RegimenStyles";
import Colors from "../../constants/Colors";

import { StyleSheet, ScrollView } from "react-native";
import { AppText } from "../../components";
import { View, Button, Card, CardItem } from "native-base";

import { ScreenNames } from "../../constants/Screens";
import InputCodeView from "./views/InputCodeView";
import ConfirmRegimenView from "./views/ConfirmRegimenView";
import RegimenIntroView from "./views/RegimenIntroView";
import SelectDateView from "./views/SelectDateView";
import { fakeRegimenObject } from "../../libs/scijs/stub/fakeRegimen";
import SetupRemindersView from "./views/SetupRemindersView";
import SelectMeasurementsView from "./views/SelectMeasurementsView";
import PrecautionView from "./views/PrecautionView";
import CompletionView from "./views/CompletionView";

import moment from "moment";
import AppInitializer from "../../services/AppInitializer";
import UsageLogger, { UsageEvents } from "../../services/UsageLogger";

// This is a singleton. 
const appService = AppService.instance;
const appStore = AppStore.instance;
const appInitializer = AppInitializer.instance;
const logger = UsageLogger.instance;

const StateNames = {
  inputCode: 'showInputCode',
  confirmRegimen: 'showConfirmRegimen',
  schedule: 'showSchedule',
  selectDate: 'showSelectDate',
  setupReminders: 'showSetupReminders',
  selectMeasurements: 'showSelectMeasurements',
  precaution: 'showPrecaution',
  completion: 'showCompletion',
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
      onEntry: [StateNames.inputCode, 'hideNavBtns'],
      on: {
        [StateEvents.NEXT]: StateNames.confirmRegimen
      }
    },
    [StateNames.confirmRegimen]: {
      onEntry: [StateNames.confirmRegimen, 'hideNavBtns'],
      on: {
        [StateEvents.PREVIOUS]: StateNames.inputCode,
        [StateEvents.NEXT]: StateNames.schedule
      },
    },
    [StateNames.schedule]: {
      onEntry: [StateNames.schedule, 'showNavBtns'],
      on: {
        [StateEvents.PREVIOUS]: StateNames.confirmRegimen,
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
      onEntry: [StateNames.completion, 'saveRegimen'],
      on: {
        [StateEvents.PREVIOUS]: StateNames.precaution,
        [StateEvents.NEXT]: StateNames.main,
      },
    },
    [StateNames.main]: {
      onEntry: 'goToMain'
    }
  }
}


type State = {
  regimen: ?IRegimen,
  errorMsg: string,

  // In certain views such as regimen redeem, 
  // we will not use the Back/Next button. 
  isNextBtnDisplayed: boolean,
  isBackBtnDisplayed: boolean
}

const initialState = {
  regimen: null,
  errorMsg: '',
  isNextBtnDisplayed: true, 
  isBackBtnDisplayed: true
}

const NUM_INDICATOR_STATES = 9;

const SCOPE = "RegimenRedeemScreen";

class RegimenRedeemScreen extends Component<any, State> {

  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    logger.logEvent(UsageEvents.redeem_begin);
  }

  goToMain = () => {
    logger.logEvent(UsageEvents.redeem_complete);
    this.props.navigation.navigate(ScreenNames.RegimenMain);
  }

  goToPrevious = () => {
    console.log("goToPrevious");
    this.props.transition(StateEvents.PREVIOUS);
  }

  goToNext = () => {
    console.log("goToNext");
    this.props.transition(StateEvents.NEXT);
  }

  hideNavBtns = () => {
    this.toggleNavBtns(false);
  }

  showNavBtns = () => {
    console.log("show nav btns");
    this.toggleNavBtns(true);
  }

  toggleNavBtns = (visible: boolean) => {
    this.setState({ 
      isNextBtnDisplayed: visible,
      isBackBtnDisplayed: visible
    })
  }

  toggleNextBtn = (visible: boolean) => {
    this.setState({
      isNextBtnDisplayed: visible
    })
  }

  toggleBackBtn = (visible: boolean) => {
    this.setState({
      isBackBtnDisplayed: visible
    })
  }

  showBackBtn = () => {
    this.toggleBackBtn(true);
  }

  hideBackBtn = () =>  {
    this.toggleBackBtn(false);
  }


  loadFakeRegimen = (): RegimenObject => {
    return fakeRegimenObject;
  }
  
  // Find a regimen based on code. 
  findRegimenByCode = async (code: string) => {
    console.log(SCOPE, "findRegimenByCode");
    // Will set errorMsg. 
    try {
      let regimenObj = await appService.ds.getRegimenByCode(code)

      // Debug
      // let regimenObj = this.loadFakeRegimen();

      let regimen = RegimenFactory.createRegimenFromObj(regimenObj);
      this.setState({regimen: regimen}, () => {
        this.props.transition(StateEvents.NEXT)
      });

    } catch (e) {
      if (e.name === 'NotExistError') {
        this.setState({errorMsg: "Invalid Redeem Code"});
      } else if (e.name === "DuplicateRegimenError")  {
        this.setState(
          {
            errorMsg: "There is a problem with this code." +
              "Please contact the research team."
          })
      } else {
        console.log(e);
      }
    }
  }

  // @deprecated. 
  // Initially we let the user first adopts a regimen, then set the parameters, as 
  // designed in our UI mockup. However, this creates a problem: what if the user 
  // adopted a regimen, but did not complete the parameter setup? Currently our
  // UI mockup does not consider this flow, so I do not allow this flow to happen. 
  adoptRegimen = async () => {
    // Set the regimen's uid to be the current user. 
    // Change the state of the regimen from notRedeemed to active. 
    let { regimen } = this.state;
    
    if(regimen) {
      // Move to the next step.       
      this.props.transition(StateEvents.NEXT);
    }
  }

  saveRegimen = async () => {
    console.log(SCOPE, "saveRegimen");
    let { regimen } = this.state;
    if(regimen) {
      let userProfile = await appStore.getUserProfile();
      regimen.setUserId(userProfile.uid);
      regimen.setStatus(RegimenStatusOptions.active);
      await appService.ds.upsertRegimen(regimen.toObj());
      appInitializer.onRegimenRedeemed()
        
    }
  }

  
  /** Update the start date of a regimen. 
   * @param  {DateTypeISO8601} startDate
   */
  setRegimenStartDate = (startDate: DateTypeISO8601) => {
    const { regimen } = this.state;
    if (regimen) {
      regimen.setStartDate(moment(startDate));
      regimen.make();
      this.setState({regimen: regimen});  
    }
  }

  updateReminderConfig = (id: string, config: ReminderConfigObject) => {
    console.log(SCOPE, "updateReminderConfig", config);
    const { regimen } = this.state;
    if (regimen) {
      regimen.setReminderConfig(id, config);
    }
  }

  render() {
    const { 
      errorMsg, isNextBtnDisplayed, isBackBtnDisplayed 
    } = this.state;
    let { regimen } = this.state;
    regimen = ((regimen: any): IRegimen);

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Action is={StateNames.inputCode}>
              <InputCodeView 
                onRedeemed={this.findRegimenByCode}
                errorMsg = {errorMsg}
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={0}
              />
            </Action>
            <Action is={StateNames.confirmRegimen}>
              <ConfirmRegimenView 
                regimen={regimen}
                onConfirmed={this.adoptRegimen}
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={1}
              />
            </Action>
            <Action is={StateNames.schedule}>
              <RegimenIntroView 
                regimen={regimen}
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={2}
              />
            </Action>
            <Action is={StateNames.selectDate}>
              <SelectDateView 
                regimen={regimen}
                onDateSelected={this.setRegimenStartDate}
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={3}
              />
            </Action>
            <Action is={StateNames.setupReminders}>
              <SetupRemindersView 
                regimen={regimen}
                updateReminderConfig={this.updateReminderConfig}
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={4}
              />
            </Action>
            <Action is={StateNames.selectMeasurements}>
              <SelectMeasurementsView 
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={5}
                regimen={regimen}
              />
            </Action>
            <Action is={StateNames.precaution}>
              <PrecautionView
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={6}
              />
            </Action>
            <Action is={StateNames.completion}>
              <CompletionView
                numStates={NUM_INDICATOR_STATES} 
                currentStateIndex={7}
              />
            </Action>

          </CardItem>
        </Card>

        
        <View style={
          isBackBtnDisplayed === true
          ? styles.nextBackBtnView
          : styles.onlyNextBtnView
        }>
          { isBackBtnDisplayed &&
            <Button 
              style={styles.button}
              iconLeft 
              bordered={true}
              onPress={this.goToPrevious}>
              <AppText style={styles.backBtnText}>
              Back
              </AppText>
            </Button>
          }
          { isNextBtnDisplayed &&
            <Button
              primary
              style={styles.nextButton}
              iconRight
              
              bordered={true}
              onPress={this.goToNext}>
              <AppText style={styles.nextBtnText}>Next</AppText>
            </Button>
          }
        </View>
      
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexGrow: 1,
    paddingLeft: 10, 
    paddingRight: 10
  },
  card: {
    width: '100%',
    marginRight: 10, 
    marginLeft: 10
    // backgroundColor: 'yellow'
  },
  cardItem: {
    width: '100%',
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  nextBackBtnView: {
    height: 50,
    width: '100%',
    flexDirection: "row",
    justifyContent: 'space-between',
    left: 0, 
    right: 0,
    marginTop: 8,
    paddingLeft: 10, 
    paddingRight: 10
  },
  onlyNextBtnView: {
    height: 50,
    flexDirection: "row",
    justifyContent: 'flex-end',
    left: 0, 
    right: 0,
    marginTop: 8,
    paddingLeft: 10, 
    paddingRight: 10,
  },
  nextButton: {
    width: 110, 
    backgroundColor: Colors.primaryColor
  },  
  button: {
    width: 110,
    // backgroundColor: Colors.primaryColor
  },
  backBtnText: {
    textAlign: 'center',
    flex: 1
  },
  nextBtnText: {
    textAlign: 'center',
    flex: 1,
    color: Colors.surfaceTextColor
  },
  dotPageIndicator: {
    marginTop: 8
  },
  warningMessage: {
    color: Colors.errorText
  }
});

export default withStateMachine(StateMachine)(RegimenRedeemScreen);