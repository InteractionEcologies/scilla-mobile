// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Container, Header, Content, Button,
  Footer, Text, Card, CardItem, Body
} from "native-base";

import { connect } from "react-redux";
import { fetchRegimens } from "../../redux/regimens/regimenActions";
import { ScreenNames } from "../../constants/Screens";
import appService from "../../app/AppService";
import RegimenList from "./views/RegimenList";
import { AppText } from "../../components"
import appState from "../../app/AppState";
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

type State = {
  regimenObject: ?RegimenObject,
  currentRegimenPhaseObject: ?RegimenPhaseObject
}

export default class RegimenMainScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: "Your Regimens"
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
    console.log("RegimenMainScreen", "componentDidMount");
    
    // appService.ds.fetchRegimens(appService.auth.currentUser.uid)
    //   .then( (regimens) => {
    //     console.log(regimens);
    //   })
    // this.props.dispatch(fetchRegimens());
    
    // DEBUG
    // Stub the data.
    // let regimenObject = fakeRegimenObject;
    // let regimen = RegimenFactory.createRegimenFromObj(regimenObject);
    // appState.regimensById.set(regimen.id, regimen);
    // appState.activeRegimenId = regimen.id;

    this.initializeState();
  }

  componentWillFocus = (payload: any) => {
    console.info("willFocus", payload);
    this.componentDidMount();
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  initializeState() {
    if(!appState.hasRegimens()) {

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

    if(appState.activeRegimenId) {
      let regimen = appState.regimensById.get(appState.activeRegimenId);
      if(regimen) {
        let regimenPhaseObject = regimen.getRegimenPhaseObjByDate(moment().format(DateFormatISO8601));
        if(regimenPhaseObject) {
          this.setState({
            currentRegimenPhaseObject: regimenPhaseObject
          });
        }
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