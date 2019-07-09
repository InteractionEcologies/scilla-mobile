// @flow
import React, { Component, Fragment } from "react";
import { StyleSheet } from "react-native";

import { IRegimen, IRegimenPhase } from "../../libs/scijs";

import { AppText, Title } from "../../components";
import { View, Button, Spinner } from "native-base";
import Modal from "react-native-modal";
import RegimenPhaseTransitionBriefing from "../../components/RegimenPhaseTransitionBriefing";

import { Styles as AppStyles } from "../../constants/Styles";
import Colors from "../../constants/Colors";

import AppStore from "../../services/AppStore";
import AppClock from "../../services/AppClock";
import AppNotificationManager from "../../services/AppNotificationManager";
import { ScreenNames } from "../../constants/Screens";


const appStore = AppStore.instance;
const appClock = AppClock.instance;
const appNotiManager = AppNotificationManager.instance;

const RegimenUpdateActionTypes = {
  increase: 'increase', 
  decrease: 'decrease',
  extend: 'extend'
}

type RegimenUpdateActionType = $Values<typeof RegimenUpdateActionTypes>;

type State = {
  regimen: ?IRegimen,
  isLoading: boolean,

  isPhaseChangeModalVisible: boolean,
  isExtendModalVisible: boolean, 
  isSelectPhaseModalVisible: boolean,

  updateActionType: ?RegimenUpdateActionType,
  moveFromPhase: ?IRegimenPhase, 
  moveToPhase: ?IRegimenPhase,
  

  canIncreaseDosage: boolean, 
  canDecreaseDosage: boolean, 
  canExtendDosage: boolean,
  canSelectIdealPhase: boolean
}

const initialState = {
  regimen: null,
  isLoading: false,

  isPhaseChangeModalVisible: false,
  isExtendModalVisible: false,
  isSelectPhaseModalVisible: false,

  updateActionType: null,
  moveFromPhase: null, 
  moveToPhase: null,

  canIncreaseDosage: false, 
  canDecreaseDosage: false, 
  canExtendDosage: false,
  canSelectIdealPhase: false
}


const SCOPE = "RegimenEditScreen";
export default class RegimenEditScreen extends Component<any, State> {

  componentWillFocusSubscription: any;

  constructor(props: any) {
    super(props);
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    )
    this.state = initialState;
  }

  async componentDidMount() {
    console.log(SCOPE, "didMount");
    // this.setState({isLoading: true});
    // this.initializeState();
    // this.setState({isLoading: false});
  }

  componentWillFocus = async (payload: any) => {
    console.log(SCOPE, "willFocus");
    this.initializeState();
  }

  async initializeState() {
    let regimen = await appStore.getLatestRegimen();
    let now = appClock.now();
    if(regimen) {
      let phase = regimen.getActiveRegimenPhase();
      let canExtendDosage = false;
      if(phase) {
        canExtendDosage = true;
      }

      let canSelectIdealPhase = false;
      if (now.isAfter(regimen.startDate, 'day')) {
        canSelectIdealPhase = true;
      }
      this.setState({
        regimen: regimen,
        canIncreaseDosage: regimen.canMoveToNextPhase(now),
        canDecreaseDosage: regimen.canMoveToPreviousPhase(now),
        canExtendDosage: canExtendDosage,
        canSelectIdealPhase: canSelectIdealPhase
      })
    }
  }


  handleIncreaseDosage = () => {
    // pop up a dialogue 
    // that dialogue should know we want to increase dosage 
    // it will fetch the current and the next dosage and then ask for conformation. 
    console.log(SCOPE, 'increase dosage');
  
    const { regimen } = this.state;
    if (regimen == null) return;

    let activePhase = regimen.getActiveRegimenPhase();
    let nextPhase = null;
    if(activePhase) {
      nextPhase = regimen.getRegimenPhaseByOrder(activePhase.phase+1);
    }

    this.setState({
      isPhaseChangeModalVisible: true,
      updateActionType: RegimenUpdateActionTypes.increase, 
      moveFromPhase: activePhase, 
      moveToPhase: nextPhase
    });

  }

  handleDecreaseDosage = () => {
    console.log(SCOPE, 'decrease dosage');
    const { regimen } = this.state;
    if (regimen == null) return;

    let activePhase = regimen.getActiveRegimenPhase();
    let nextPhase = null;
    if(activePhase) {
      nextPhase = regimen.getRegimenPhaseByOrder(activePhase.phase-1);
    }

    this.setState({
      isPhaseChangeModalVisible: true,
      updateActionType: RegimenUpdateActionTypes.decrease, 
      moveFromPhase: activePhase, 
      moveToPhase: nextPhase
    });

  }

  handleExtendDosage = () => {
    console.log(SCOPE, 'extend phase');
    const { regimen } = this.state;
    if (regimen == null) return;
    let activePhase = regimen.getActiveRegimenPhase();

    this.setState({
      isExtendModalVisible: true,
      updateActionType: RegimenUpdateActionTypes.extend, 
      moveFromPhase: activePhase, 
      moveToPhase: activePhase
    });
  }

  handleSelectIdealPhase = () => {
    this.props.navigation.navigate(ScreenNames.RegimenSelectIdealPhase);
  }

  hidePhaseChangeModal = () => {
    this.setState({isPhaseChangeModalVisible: false});
  }

  hideExtendModal = () => {
    this.setState({isExtendModalVisible: false})
  }

  hideSelectPhaseModal = () => {
    this.setState({isSelectPhaseModalVisible: false});
  }

  confirmUpdate = () => {
    const { updateActionType, regimen } = this.state;
    const now = appClock.now();
    if(updateActionType == null) return;
    if(regimen == null) return;

    switch(updateActionType) {
      case RegimenUpdateActionTypes.increase:
        regimen.grantPermissionToNextPhase();
        regimen.transitionToNextPhase(now);
        break;
      case RegimenUpdateActionTypes.decrease:
        regimen.transitionToPreviousPhase(now);
        break;
      case RegimenUpdateActionTypes.extend:
        regimen.extendActivePhase(now);
        break;
      default:
        return;
    }

    appStore.updateRegimen(regimen);
    // Update notifications 
    appNotiManager.setNotificationsByReminderConfigs(regimen.reminderConfigs);

    this.setState({
      isPhaseChangeModalVisible: false, 
      updateActionType: null, 
      moveFromPhase: null, 
      moveToPhase: null
    })

    this.props.navigation.popToTop();
  }

  render() {
    const { isLoading, 
      isPhaseChangeModalVisible, 
      isExtendModalVisible,
      isSelectPhaseModalVisible, 
      canIncreaseDosage, 
      canDecreaseDosage,
      canExtendDosage, 
      moveFromPhase, 
      moveToPhase
    } = this.state;
    return (
      <View style={AppStyles.contentBody}>
        {isLoading &&
          <Spinner 
            color={Colors.primaryColor}
          />
        }
        {!isLoading && 
        <Fragment>
          <Title style={{fontSize: 20, marginBottom: 10}}>Regimen Actions</Title>
          <Button 
            full
            disabled={!canIncreaseDosage}
            style={styles.button}
            onPress={this.handleIncreaseDosage}
          >
            <AppText>Increase Dosage</AppText>
          </Button>
          <Button
            full
            disabled={!canDecreaseDosage}
            style={styles.button}
            onPress={this.handleDecreaseDosage}
          >
            <AppText>Decrease Dosage</AppText>
          </Button>
          <Button
            full
            disabled={!canExtendDosage}
            style={styles.button}
            onPress={this.handleExtendDosage}
          >
            <AppText>Extend Current Phase</AppText>
          </Button>
          <Button 
            style={styles.button}
            full
            onPress={this.handleSelectIdealPhase}
          >
            <AppText>Select Ideal Dosage</AppText>
          </Button>
          </Fragment>
        }
        <Modal
          isVisible={isPhaseChangeModalVisible}
        >
          <View style={styles.modal}>
            <Title style={{fontSize: 20, marginTop: 20}}>Please confirm</Title>
            <RegimenPhaseTransitionBriefing 
              prevPhase={moveFromPhase}
              nextPhase={moveToPhase}
            />
            <View style={styles.modalBtnView}>
              <Button
                onPress={this.hidePhaseChangeModal}
                bordered
                // style={{flex: 1}}
              >
                <AppText>Cancel</AppText>
              </Button>
              <Button
                onPress={this.confirmUpdate}
                // style={{flex: 1}}
              >
                <AppText>Confirm</AppText>
              </Button>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isExtendModalVisible}
        >
          <View style={styles.modal}>
            <Title style={{fontSize: 20, marginTop: 20, marginBottom: 20}}>Extend current phase?</Title>
            <AppText style={{marginLeft: 30, marginRight: 30}}>
              This will extend your current phase by a week from today. Do you want to proceed?
            </AppText>
            <View style={styles.modalBtnView}>
              <Button
                onPress={this.hideExtendModal}
                bordered
                // style={{flex: 1}}
              >
                <AppText>Cancel</AppText>
              </Button>
              <Button
                onPress={this.confirmUpdate}
                // style={{flex: 1}}
              >
                <AppText>Confirm</AppText>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceColor
  },  
  modalBtnView: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    paddingLeft: 30, 
    paddingRight: 30,
    // backgroundColor: 'red',
    width: '100%'
  }
})