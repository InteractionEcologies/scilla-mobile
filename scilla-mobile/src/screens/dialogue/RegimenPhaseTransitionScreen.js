// @flow
import React, { Component } from "react";
import { View, Button } from "native-base";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";

import { AntDesign } from "@expo/vector-icons";
import { Title, AppText } from "../../components";
import RegimenPhaseTransitionBriefing from "../../components/RegimenPhaseTransitionBriefing";

import type { RegimenPhaseChangeRequestType, IRegimenPhase } from "../../libs/scijs";
import { RegimenPhaseChangeRequestTypes, IRegimen, RegimenPhasePermissionOptions } from "../../libs/scijs";

import NavigationService from "../../navigation/NavigationService";
import AppStore from "../../app/AppStore";

import moment from "moment";
import AppService from "../../app/AppService";

const appStore = AppStore.instance;
const appService = AppService.instance;

type State = {
  phaseChangeType: ?RegimenPhaseChangeRequestType,
  regimen: ?IRegimen
}

const initialState = {
  phaseChangeType: null,
  regimen: null
}

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
      let type = regimen.getPhaseChangeRequestType();
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
        return this._renderChangeToNextPhase();
      case RegimenPhaseChangeRequestTypes.willComplete:
        return (<View/>)
      default:
        return (<View/>)
    }
  }

  onPressedDoNotChange = () => {

  }

  onPressedAccept = () => {
    const { regimen } = this.state;
    if(!regimen) { return; }

    let phase = regimen.getActiveRegimenPhase();

    // FIXME: This is a tech-debt ... the regimen instance and database object are
    // two different things. We need to save it whenever we make a change. 
    // Ideally this should be just one thing. 
    if(phase) {
      phase.permission = RegimenPhasePermissionOptions.willTry;
      appService.ds.upsertRegimen(regimen.toObj());  
    }

    this.dismiss();
  }

  /**
   * For situation before an expected new phase. 
   */
  _renderChangeToNextPhase() {
    const { regimen } = this.state;
    return (
      <View>
        <AntDesign name="exclamationcircle" size={80}/>
      </View>
    )
  }

  /**
   * Render view for situation after a new phase is expected to start. 
   */
  _renderConfirmNewPhase() {
    const { regimen } = this.state;
    if(!regimen) { return <View/>}

    let lastTryPhase = regimen.getLastPermittedRegimenPhase();
    let phase = regimen.getActiveRegimenPhase();
    return (
      <View style={{flex: 1}}>
        <Modal
          isVisible={true}
        >
          <View style={{justifyContent: "center", alignItems: "center", backgroundColor: 'white'}}>
            <AntDesign name="exclamationcircle" size={80} style={{marginTop: 20}}/>
            <AppText>Try out next dosage level?</AppText>
            <RegimenPhaseTransitionBriefing 
              prevPhase={lastTryPhase}
              nextPhase={phase}
            />
            <View style={styles.buttonsView}>
              <Button 
                full
                bordered style={styles.button}
                onPress={this.onPressedDoNotChange}
              >
                <AppText>Extend current phase</AppText>
              </Button>
              <Button
                full 
                style={[styles.button]}
                onPress={this.onPressedAccept}
              >
                <AppText>Accept</AppText>
              </Button>
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