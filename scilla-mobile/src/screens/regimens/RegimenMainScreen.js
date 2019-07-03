// @flow
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Container, Content, Button,
  Card, CardItem, Body, Spinner
} from "native-base";

import { ScreenNames } from "../../constants/Screens";
import { AppText } from "../../components"
import { fakeRegimenObject } from "../../libs/scijs/stub/fakeRegimen";
import { RegimenFactory, IRegimen } from "../../libs/scijs/models/regimen";
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
import AppStore from "../../app/AppStore";
import AppClock from "../../app/AppClock";
import AppInitializer from "../../app/AppInitializer";
import { Calendar } from "../../components/Calendar";
import Colors from "../../constants/Colors";

type State = {
  regimen: ?IRegimen,
  currentRegimenPhaseObject: ?RegimenPhaseObject,
  isCheckingLatestRegimen: boolean
}

const appStore = new AppStore();
const appClock = new AppClock();
const appInitializer = new AppInitializer();

const SCOPE = "RegimenMainScreen";

export default class RegimenMainScreen extends React.Component<any, State> {
  _isMounted = false
  

  static navigationOptions: any = {
    title: "Regimen"
  };

  state = {
    regimen: null,
    currentRegimenPhaseObject: null,
    isCheckingLatestRegimen: true
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
    this._isMounted = true;

    this.initializeState();
  }

  componentWillFocus = (payload: any) => {
    // console.info("willFocus", payload);
    this.initializeState();
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
    this._isMounted = false;
  }


  addFakeData() {
    let regimenObject = fakeRegimenObject;
    let regimen = RegimenFactory.createRegimenFromObj(regimenObject);
    appStore.insertRegimen(regimen);
  }

  async initializeState() {
    if(!this._isMounted) return;
    this.setState({isCheckingLatestRegimen: true});
    let regimen: ?IRegimen = null;

    try {
      regimen = await appStore.getLatestRegimen();
    } catch (e) {
      // Regimen does not exist. Do nothing. 
      if(e.name === "NotExistError") {
        console.log(SCOPE, "Regimen does not exist");
      } 
    }

    if(regimen) {
      try {
        // Find today's regimen phase. 
        let today = appClock.now().local();
        
        let regimenPhaseObject = regimen.getRegimenPhaseObjByDate(today);
        this.setState({
          regimen: regimen,
          currentRegimenPhaseObject: regimenPhaseObject
        });  
        appInitializer.updateRegimenPhaseAndRequestPermission();
      
      } catch (e) {
        if(e.name === "NotExistError") {
          // A regimen exist but the phase is not started yet. 
          // Showing the first regimen phase. 
          // Assume there is at least one regimen phase for now.
          let regimenPhaseObject = regimen.getRegimenPhaseObjs()[0];
          this.setState({
            regimen: regimen,
            currentRegimenPhaseObject: regimenPhaseObject
          });
        }
      }
    }

    this.setState({isCheckingLatestRegimen: false})
  }


  getMarkedDays() {
    const { regimen, currentRegimenPhaseObject } = this.state;

    let markedDates = {};
    if(regimen) {
      let regimenPhases = regimen.getRegimenPhases();

      _.map(regimenPhases, (regimenPhase) => {
        let startDate = regimenPhase.startDate;
        let endDate = regimenPhase.endDate
        // let treatmentObjs = regimenPhase.treatmentObjects;
        
        let color = Colors.greyColor;
        if(currentRegimenPhaseObject 
          && regimenPhase.phase === currentRegimenPhaseObject.phase) {
          // highlighted regimen phase: either a current regimen
          // or the first phase if we have not reached the start date of 
          // a regimen. 
          color = Colors.primaryColor;

        }
        let curDateM = moment(startDate);
        let endDateM = moment(endDate);

        while (curDateM.isSameOrBefore(endDateM)) {
          let curDate = curDateM.format(DateFormatISO8601);
          markedDates[curDate] = {
            color: color
          }
          curDateM.add(1, 'day')
        }
        markedDates[startDate.format(DateFormatISO8601)] = {
          startingDay: true, 
          color: color
        }
        markedDates[endDate.format(DateFormatISO8601)] = {
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

  goToRedeemRegimen = () => {
    this.props.navigation.navigate(ScreenNames.RegimenRedeem);
  }

  goToUpdateRegimen = (regimenId: string) => {
    console.dir(regimenId);
  }

  render() {
    const { isCheckingLatestRegimen } = this.state;
    return (
      <Container>
        <ScrollView>
          <Content contentContainerStyle={AppStyles.content}>
            <View style={AppStyles.contentBody}>
              {isCheckingLatestRegimen &&
                <Spinner color={Colors.primaryColor}/>
              } 
              {!isCheckingLatestRegimen &&
                this.renderRegimen()
              }
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
      // Currently we don't allow users to create their own 
      // regimens. All the regimens are created by the research team, 
      // based on a clinician's prescription. 
      // return this._renderRegimenCreation();

      return this._renderRegimenRedeem();
    }
  }

  // Render the current or upcoming regimen phase and the whole regimen. 
  _renderActiveRegimen() {
    const { regimen, currentRegimenPhaseObject } = this.state;
    if (!regimen) return;

    let regimenHasStarted = true;
    let startDate: string = _.get(currentRegimenPhaseObject, "startDate", null);
    let endDate: string = _.get(currentRegimenPhaseObject, "endDate", null);

    if(startDate) {
      startDate = moment(startDate).format(DateFormatUXFriendly);
    }
    if(endDate) {
      endDate = moment(endDate).format(DateFormatUXFriendly);
    }

    let today = appClock.now();
    if(today.isBefore(moment(regimen.startDate))) {
      regimenHasStarted = false;
    }

    let markedDates = this.getMarkedDays();
      
    return (
      <View style={{width: '100%'}}>
        <Card style={styles.currentRegimenPhaseCard}>
          <CardItem header bordered>
            {regimenHasStarted &&
              <AppText>Current Regimen Phase</AppText>
            }
            {!regimenHasStarted &&
              <AppText>Upcoming First Regimen Phase</AppText>
            }
          </CardItem>
          <CardItem>
            <Body>
              <AppText>{startDate} - {endDate}</AppText>
            </Body>
          </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>
            <AppText>Regimen Schedule</AppText>
          </CardItem>
          <CardItem>
            <Calendar style={{width: '100%'}}
              current={appClock.now().format(DateFormatISO8601)}
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

  _renderRegimenRedeem() {
    return (
      <Button full onPress={this.goToRedeemRegimen}>
        <AppText>Redeem Regimen by Code</AppText>
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  currentRegimenPhaseCard: {
    width: '100%'
  }
});