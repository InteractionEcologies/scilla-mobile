// @flow
import React from "react";

import { connect } from "react-redux";
import { fetchTrials } from "../../redux/trials/trialActions";

import BaseScreen from "../BaseScreen";
import { ScreenNames } from "../../constants/Screens";
import appService from "../../AppService";
import TrialList from "../../components/TrialList";

export default class TrialBaseScreen extends BaseScreen {
  

  goToTypeSelectionScreen = () => this.navigate(ScreenNames.TrialTypeSelection);
  goToTypeOverviewScreen = () => this.navigate(ScreenNames.TrialTypeOverview);
  goToVarSelectionScreen = () => this.navigate(ScreenNames.TrialVarSelection);
  goToDateSelectionScreen = () => this.navigate(ScreenNames.TrialDateSelection);
  goToReminderConfigScreen = () => this.navigate(ScreenNames.TrialReminderConfig);
  goToTrialSummaryScreen = () => this.navigate(ScreenNames.TrialSummary);


  goToCreateTrial = () => {
    this.navigate(ScreenNames.TrialCreate);
  }

  goToUpdateTrial = (trialId: string) => {
    console.dir(trialId);
  }

}
