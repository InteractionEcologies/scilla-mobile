// @flow
import React from "react";

import { connect } from "react-redux";
import { fetchRegimens } from "../../redux/regimens/regimenActions";

import BaseScreen from "../BaseScreen";
import { ScreenNames } from "../../constants/Screens";
import appService from "../../AppService";
import RegimenList from "./components/RegimenList";

export default class RegimenBaseScreen extends BaseScreen {
  

  goToTypeSelectionScreen = () => this.navigate(ScreenNames.RegimenTypeSelection);
  goToTypeOverviewScreen = () => this.navigate(ScreenNames.RegimenTypeOverview);
  goToVarSelectionScreen = () => this.navigate(ScreenNames.RegimenVarSelection);
  goToDateSelectionScreen = () => this.navigate(ScreenNames.RegimenDateSelection);
  goToReminderConfigScreen = () => this.navigate(ScreenNames.RegimenReminderConfig);
  goToRegimenSummaryScreen = () => this.navigate(ScreenNames.RegimenSummary);


  goToCreateRegimen = () => {
    this.navigate(ScreenNames.RegimenCreate);
  }

  goToUpdateRegimen = (regimenId: string) => {
    console.dir(regimenId);
  }

}
