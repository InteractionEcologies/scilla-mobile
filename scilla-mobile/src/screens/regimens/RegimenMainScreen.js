// @flow
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Container, Content, Button,
  Card, CardItem, Body
} from "native-base";

import { ScreenNames } from "../../constants/Screens";
import { AppText } from "../../components"
import { fakeRegimenObject } from "../../datafixtures/fakeRegimen";
import { RegimenFactory, Regimen } from "../../libs/scijs/models/regimen";
import type { 
  RegimenPhaseObject
} from "../../libs/scijs";
import {
  DateFormatUXFriendly,
  DateFormatISO8601
} from "../../libs/scijs";
import _ from "lodash";
import moment from "moment";
import { Styles as AppStyles } from "../../constants/Styles";
import AppState from "../../app/AppState";
import { Calendar } from "../../components/Calendar";
import Colors from "../../constants/Colors";

type State = {
  regimen: ?Regimen,
  currentRegimenPhaseObject: ?RegimenPhaseObject
}

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
  phaseColors = 
    [ Colors.primaryLightColor,
      Colors.primaryColor, 
      Colors.primaryDarkColor,
      Colors.accentLightColor
    ]

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
      console.log(e);
    }
  }


  getMarkedDays() {
    console.log("getMarkedDays");
    let markedDates = {};
    if(this.state.regimen) {
      const { regimen } = this.state;
      let regimenPhases = regimen.getRegimenPhases();
      _.map(regimenPhases, (regimenPhase) => {
        let startDate = regimenPhase.startDate;
        let endDate = regimenPhase.endDate
        // let treatmentObjs = regimenPhase.treatmentObjects;
        
        let color = this.phaseColors[regimenPhase.phase % this.phaseColors.length ]
        let curDateM = moment(startDate);
        let endDateM = moment(endDate);

        while (curDateM.isSameOrBefore(endDateM)) {
          let curDate = curDateM.format(DateFormatISO8601);
          markedDates[curDate] = {
            color: color
          }
          curDateM.add(1, 'day')
        }
        markedDates[startDate] = {
          startingDay: true, 
          color: color
        }
        markedDates[endDate] = {
          endingDay: true,
          color: color
        }

      })

    }
    return markedDates
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
      <Container>
        <ScrollView>
          <Content contentContainerStyle={AppStyles.content}>
            <View style={AppStyles.contentBody}>
              {this.renderRegimen()}
            </View>
          </Content>
        </ScrollView>
      </Container>
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

    let markedDates = this.getMarkedDays();
    console.log(markedDates);
      
    return (
      <View style={{width: '100%'}}>
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

        <Card>
          <CardItem header bordered>
            <AppText>Whole Regimen</AppText>
          </CardItem>
          <CardItem>
            <Calendar style={{width: '100%'}}
              markedDates={markedDates}
              markingType="period"
            />
          </CardItem>
        </Card>

      </View>
    )
  }

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