// @flow
import React, { Component } from "react";
import { View, Button, Toast } from "native-base";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";

import { AntDesign } from "@expo/vector-icons";
import { Title, AppText } from "../../components";
import RegimenPhaseTransitionBriefing from "../../components/RegimenPhaseTransitionBriefing";

import type { RegimenPhaseChangeRequestType } from "../../libs/scijs";
import { RegimenPhaseChangeRequestTypes, IRegimen, DateFormatISO8601 } from "../../libs/scijs";

import NavigationService from "../../navigation/NavigationService";
import AppStore from "../../services/AppStore";

import AppService from "../../services/AppService";
import AppClock from "../../services/AppClock";
import AppNotificationManager from "../../services/AppNotificationManager";

const appStore = AppStore.instance;
const appService = AppService.instance;
const appClock = AppClock.instance;
const appNotiManager = AppNotificationManager.instance;

type State = {
  phaseChangeType: ?RegimenPhaseChangeRequestType,
  regimen: ?IRegimen
}

const initialState = {
  phaseChangeType: null,
  regimen: null
}

const SCOPE = "RegimenPhaseTransitionScreen"

export default class RegimenPhaseTransitionScreen extends Component<any, State> {

  // componentWillFocusSubscription: any;
  
  constructor(props: any) {
    super(props);

    this.state = initialState;
    // this.componentWillFocusSubscription = this.props.navigation.addListener(
    //   'willFocus',
    //   this.componentWillFocus
    // )
  }

  async componentDidMount() {
    // Need to get transition type
    try {
      let regimen: IRegimen = await appStore.getLatestRegimen();
      let type = regimen.getPhaseChangeRequestType(appClock.now());
      console.log(SCOPE, "phase change type", type);
      this.setState({regimen: regimen, phaseChangeType: type});
    } catch (e) {
      console.log(e);
    }
  }

  // componentWillFocus = async (payload: any) => {
  //   this.updateDate(this.state.current);
  // }

  _loadRegimen = async () => {

  }

  dismiss = () => {
    NavigationService.back();
  }

  render() {
    let { phaseChangeType } = this.state;

    switch(phaseChangeType) {
      case RegimenPhaseChangeRequestTypes.willStart:
          return this._renderConfirmNewPhase();
      case RegimenPhaseChangeRequestTypes.willGoToNextPhase:
        return this._renderConfirmNewPhase();
      case RegimenPhaseChangeRequestTypes.willComplete:
        return (<View/>)
      default:
        return (<View/>)
    }
  }

  didPressExtend = async () => {
    const { regimen } = this.state;
    if(!regimen) return;

    regimen.extendActivePhase(appClock.now());
    await appStore.updateRegimen(regimen);

    let phase = regimen.getActiveRegimenPhase();
    if(phase) {
      Toast.show({
        text: `This phase is extended to ${phase.endDate.format(DateFormatISO8601)}`,
        buttonText: 'OK'
      })
    }
    
    this.dismiss();
  }

  /**
   * Two situations: 
   *  - Grant permission before the phase starts. 
   *  - Grant permission after the phase starts. 
   *  - Grant permission to phase n, during phase n+k's period. 
   *    - Should update phase n's end date to today+7 days. 
   */
  didPressAccept = async () => {
    const { regimen } = this.state;
    if(!regimen) { return; }

    regimen.grantPermissionToNextPhase();
    regimen.updatePhase(appClock.now());
    await appService.ds.upsertRegimen(regimen.toObj());    
    let reminderConfigs = regimen.getActiveReminderConfigs();
    await appNotiManager.setNotificationsByReminderConfigs(reminderConfigs);

    this.dismiss();
  }

  /**
   * Render view for situation after a new phase is expected to start. 
   */
  _renderConfirmNewPhase() {
    const { regimen } = this.state;
    if(!regimen) { return <View/>}

    let phase = regimen.getActiveRegimenPhase();
    let nextPhase;
    if(phase) {
      nextPhase = regimen.getRegimenPhaseByOrder(phase.phase+1);
    } else {
      nextPhase = regimen.getRegimenPhaseByOrder(0);
    }

    let title = "Try out next dosage level?"
    if(phase == null) {
      title = "Start your regimen?"
    } 
      
    return (
      <View style={{flex: 1}}>
        <Modal
          isVisible={true}
        >
          <View style={{justifyContent: "center", alignItems: "center", backgroundColor: 'white'}}>
            <AntDesign name="exclamationcircle" size={80} style={{marginTop: 20}}/>
            <Title>{title}</Title>
            <RegimenPhaseTransitionBriefing 
              prevPhase={phase}
              nextPhase={nextPhase}
            />
            <View style={styles.buttonsView}>
              <Button
                full 
                style={[styles.button, {marginBottom: 10}]}
                onPress={this.didPressAccept}
              >
                <AppText>Accept</AppText>
              </Button>
              {!!phase &&
                <Button 
                full
                bordered style={styles.button}
                onPress={this.didPressExtend}
              >
                <AppText numberOfLines={2}>Extend current phase</AppText>
              </Button>
              }
              
            </View>
          </View>
        </Modal>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  buttonsView: {
    // flex: 1,
    width: '90%',
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  button: {
    // width: 150, 
    justifyContent: 'center'
  }
})