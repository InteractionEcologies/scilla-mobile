// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Container, Header, Content, Button,
  Footer, Text, Card, CardItem, Body
} from "native-base";

import { connect } from "react-redux";
import { ScreenNames } from "../../constants/Screens";
import AppService from "../../app/AppService";
import { AppText } from "../../components"
import { fakeRegimenObject } from "../../datafixtures/fakeRegimen";
import { RegimenFactory, Regimen } from "../../models/regimen";
import type { 
  RegimenObject,
  RegimenPhaseObject
} from "../../libs/intecojs";
import {
  DateFormatUXFriendly,
  DateFormatISO8601
} from "../../libs/intecojs";
import _ from "lodash";
import moment from "moment";
import RegimenStyles from "./RegimenStyles";
import AppState from "../../app/AppState";

type State = {
  regimen: ?Regimen,
  currentRegimenPhaseObject: ?RegimenPhaseObject
}

const appService = new AppService();
const appState = new AppState();

export default class RegimenMainScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: "Regimen"
  };

  state = {
    regimen: null,
    currentRegimenPhaseObject: null
  }
  
  componentWillFocusSubscription: any;

  constructor(props: any) {
    super(props);
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    )
  }

  componentDidMount() {
    // DEBUG
    // Stub the data.
    // this.addFakeData();

    this.initializeState();
  }

  componentWillFocus = (payload: any) => {
    console.info("willFocus", payload);
    this.initializeState();
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  addFakeData() {
    let regimenObject = fakeRegimenObject;
    let regimen = RegimenFactory.createRegimenFromObj(regimenObject);
    appState.insertRegimen(regimen);
  }

  async initializeState() {
    try {
      let regimen = await appState.getLatestRegimen();
      let today = moment().local().format(DateFormatISO8601)
      let regimenPhaseObject = regimen.getRegimenPhaseObjByDate(today);
      if(regimenPhaseObject) {
        this.setState({
          regimen: regimen,
          currentRegimenPhaseObject: regimenPhaseObject
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  // MARK: - Navigation
  goToCreateRegimen = () => {
    this.props.navigation.navigate(ScreenNames.RegimenCreation);
  }

  goToUpdateRegimen = (regimenId: string) => {
    console.dir(regimenId);
  }

  render() {
    return (
      <Content contentContainerStyle={RegimenStyles.content}>
        <View style={RegimenStyles.mainView}>
          {this.renderRegimen()}
        </View>
      </Content>
    )
  }

  renderRegimen() {
    if(this.state.regimen) {
      return this._renderActiveRegimen();
    } else {
      return this._renderRegimenCreation();
    }
  }

  _renderActiveRegimen() {
    let startDate: string = _.get(this.state.currentRegimenPhaseObject, "startDate", null);
    let endDate: string = _.get(this.state.currentRegimenPhaseObject, "endDate", null);
    if(startDate) {
      startDate = moment(startDate).format(DateFormatUXFriendly);
    }
    if(endDate) {
      endDate = moment(endDate).format(DateFormatUXFriendly);
    }

    return (
      <Card style={styles.currentRegimenPhaseCard}>
        <CardItem header bordered>
          <AppText>Current Regimen Phase</AppText>
        </CardItem>
        <CardItem>
          <Body>
            <AppText>{startDate} - {endDate}</AppText>
          </Body>
        </CardItem>
      </Card>
    )
  }

  // _renderCurrentRegimenPhase() {

  // }

  _renderRegimenCreation() {
    return (
      <Button full onPress={this.goToCreateRegimen}>
        <AppText>Create Regimen</AppText>
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  currentRegimenPhaseCard: {
    width: '100%'
  }
});