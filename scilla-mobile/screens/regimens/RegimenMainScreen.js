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
import RegimenList from "./views/RegimenList";
import { AppText } from "../../components"
import { fakeRegimenObject } from "../../datafixtures/fakeRegimen";
import { RegimenFactory } from "../../models/regimen";
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
  regimenObject: ?RegimenObject,
  currentRegimenPhaseObject: ?RegimenPhaseObject
}

const appService = AppService.instance;
const appState = AppState.instance;

export default class RegimenMainScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: "Regimen"
  };

  state = {
    regimenObject: null,
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
    appState.regimensById.set(regimen.id, regimen);
    appState.activeRegimenId = regimen.id;
  }

  initializeState() {
    if(!appState.hasRegimens()) {
      // TODO: change to fetch only "active" regimen. 
      // TODO: Need to switch to a loading view. 
      appService.ds.getRegimens(appService.auth.currentUser.uid)
        .then( (regimenObjects: RegimenObject[]) => {
          if(regimenObjects.length > 0) {
            let regimen = RegimenFactory.createRegimenFromObj(regimenObjects[0]);
            appState.regimensById.set(regimen.id, regimen);
            appState.activeRegimenId = regimen.id;
            
            this._setRegimenState();
            this._setCurrentRegimenPhaseState();
          }
        })
    } else {
      this._setRegimenState();
      this._setCurrentRegimenPhaseState();
    }
  }

  _setRegimenState() {
    let regimen = appState.getActiveRegimen();
    if(regimen) {
      this.setState({
        regimenObject: regimen.toObj()
      });
    }
  }

  _setCurrentRegimenPhaseState() {
    let regimen = appState.getActiveRegimen();
    if(regimen) {
      let regimenPhaseObject = regimen.getRegimenPhaseObjByDate(moment().format(DateFormatISO8601));
      if(regimenPhaseObject) {
        this.setState({
          currentRegimenPhaseObject: regimenPhaseObject
        });
      }
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
    if(this.state.regimenObject) {
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