// @flow
import React, { Component } from "react";
import { View, Button, Toast } from "native-base";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";

import { AntDesign } from "@expo/vector-icons";
import { Title, AppText } from "../../components";
import RegimenPhaseTransitionBriefing from "../../components/RegimenPhaseTransitionBriefing";

import type { RegimenPhaseChangeRequestType, IRegimenPhase } from "../../libs/scijs";
import { RegimenPhaseChangeRequestTypes, IRegimen, RegimenPhasePermissionOptions, DateFormatISO8601 } from "../../libs/scijs";

import NavigationService from "../../navigation/NavigationService";
import AppStore from "../../services/AppStore";

import moment from "moment";
import AppService from "../../services/AppService";
import AppClock from "../../services/AppClock";
import AppNotificationManager from "../../services/AppNotificationManager";

const appStore = AppStore.instance;
const appService = AppService.instance;
const appClock = AppClock.instance;
const appNotiManager = AppNotificationManager.instance;

export default class RegimenPhaseManualUpdateScreen extends Component<any, any> {

  dismiss = (e: any) => {
    NavigationService.back();
  }

  render() {
    return (
      <View>
        <Title>Update Regimen Phase</Title>
        <Button
          onPress={this.dismiss}
        >
          <AppText>Cancel</AppText>
        </Button>
      </View>
    )
  }
}