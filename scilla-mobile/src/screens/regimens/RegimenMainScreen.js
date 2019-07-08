// @flow
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Container, Content, Button,
  Card, CardItem, Body, Spinner
} from "native-base";

import { ScreenNames } from "../../constants/Screens";
import { AppText, RegimenSchedule } from "../../components"
import { fakeRegimenObject } from "../../libs/scijs/stub/fakeRegimen";
import { RegimenFactory, IRegimen } from "../../libs/scijs/models/regimen";
import type { 
  RegimenPhaseObject,
  ReminderConfigObject
} from "../../libs/scijs";
import {
  DateFormatUXFriendly,
  DateFormatISO8601
} from "../../libs/scijs";
import _ from "lodash";
import moment from "moment";
import { Styles as AppStyles } from "../../constants/Styles";
import AppStore from "../../services/AppStore";
import AppClock from "../../services/AppClock";
import AppInitializer from "../../services/AppInitializer";
import AppNotificationManager from "../../services/AppNotificationManager";
import { Calendar } from "../../components/Calendar";
import Colors from "../../constants/Colors";
import ReminderSwitchersCard from "../../components/ReminderSwitchersCard";

type State = {
  regimen: ?IRegimen,
  currentRegimenPhaseObject: ?RegimenPhaseObject,
  reminderConfigs: ReminderConfigObject[],
  isCheckingLatestRegimen: boolean
}

const appStore = new AppStore();
const appClock = new AppClock();
const appInitializer = new AppInitializer();
const appNotiManager = new AppNotificationManager();

const SCOPE = "RegimenMainScreen";

export default class RegimenMainScreen extends React.Component<any, State> {
  _isMounted = false
  

  static navigationOptions: any = {
    title: "Regimen"
  };

  state = {
    regimen: null,
    currentRegimenPhaseObject: null,
    reminderConfigs: [],
    isCheckingLatestRegimen: true
  }
  
  componentWillFocusSubscription: any;

  constructor(props: any) {
    super(props);
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    )
  }

  async componentDidMount() {
    this._isMounted = true;

    await appInitializer.onRegimenMainScreenLoaded();

    this.setState({isCheckingLatestRegimen: true});
    await this.initializeState();
    this.setState({isCheckingLatestRegimen: false});
  }

  componentWillFocus = async (payload: any) => {
    console.info(SCOPE, "willFocus");
    await appInitializer.onRegimenMainScreenLoaded();
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
    console.log(SCOPE, "initializeState")
    let regimen: ?IRegimen = null;

    try {
      regimen = await appStore.getLatestRegimen();
    } catch (e) {
      // Regimen does not exist. Do nothing. 
      if(e.name === "NotExistError") {
        console.log(SCOPE, "Regimen does not exist");
      } 
    }

    if(regimen == null) {
      // this.setState({isCheckingLatestRegimen: false})
      return;
    }

    let activePhase = regimen.getActiveRegimenPhase();
    if(activePhase)  {
      this.setState({
        regimen: regimen,
        currentRegimenPhaseObject: activePhase.toObj(),
        reminderConfigs: _.cloneDeep(regimen.getActiveReminderConfigs())
      });  
      this.forceUpdate();
      
    } else if (regimen.completed) {
      // Completed 
      console.debug("This regimen is completed.")
    } else {
      let upcomingPhase = regimen.getRegimenPhaseByOrder(0);
      if(upcomingPhase) {
        this.setState({
          regimen: regimen,
          currentRegimenPhaseObject: upcomingPhase.toObj()
        });
      }
    }      
  
    // this.setState({isCheckingLatestRegimen: false})
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

  didPressEditRegimenBtn = () => {
    this.props.navigation.navigate(ScreenNames.RegimenEdit);
  }

  didPressEditReminderBtn = () => {
    this.props.navigation.navigate(ScreenNames.RegimenEditReminders);
  }

  toggleReminder = (reminderSlotId: string) => {
    //
    console.log() 
    const { regimen } = this.state;
    if (regimen == null) return;

    regimen.toggleReminder(reminderSlotId);
    appStore.updateRegimen(regimen);
    let configs = regimen.getActiveReminderConfigs();
    this.setState({reminderConfigs: configs})
    appNotiManager.setNotificationsByReminderConfigs(configs);
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
      // <Container>
        <ScrollView>
          {/* Must have this contentContainerStyle to center 
            the content within the ScrollView.
          */}
          <Content contentContainerStyle={AppStyles.content}>
          {/* Must have contentBody to make sure the content area 
            has a width that expands to the whole screen with proper margin. 
          */}
            <View style={AppStyles.contentBody}>
              {isCheckingLatestRegimen &&
                <Spinner color={Colors.primaryColor}/>
              } 
              {!isCheckingLatestRegimen &&
                this.renderCreateOrShowRegimenInfoView()
              }
            </View>
          </Content>
        </ScrollView>
      // </Container>
    )
  }

  renderCreateOrShowRegimenInfoView() {
    if(this.state.regimen) {
      return this._renderRegimenInfoView();
    } else {
      // Currently we don't allow users to create their own 
      // regimens. All the regimens are created by the research team, 
      // based on a clinician's prescription. 
      // return this._renderRegimenCreation();

      return this._renderRegimenRedeem();
    }
  }

  // Render the current or upcoming regimen phase and the whole regimen. 
  _renderRegimenInfoView() {
    const { 
      regimen, 
      currentRegimenPhaseObject, 
      reminderConfigs 
    } = this.state;
    if (!regimen) return;

    let regimenHasStarted = true;

    let today = appClock.now();
    if(today.isBefore(regimen.startDate)) {
      regimenHasStarted = false;
    }

    // let markedDates = this.getMarkedDays();
    // console.log(SCOPE, currentRegimenPhaseObject);
    
    let highlightedPhaseOrder = null
    if(currentRegimenPhaseObject) {
      highlightedPhaseOrder = currentRegimenPhaseObject.phase;
    }
    return (
      <View style={{width: '100%'}}>
        <Card style={styles.currentRegimenPhaseCard}>
          <CardItem header bordered>
            {regimenHasStarted &&
              <AppText style={{flex: 4}}>Current Regimen Phase</AppText>
            }
            {!regimenHasStarted &&
              <AppText>Upcoming Regimen</AppText>
            }
            <Button small bordered style={{flex: 1}}
              onPress={this.didPressEditRegimenBtn}
            ><AppText>Edit</AppText></Button>
          </CardItem>
          <CardItem>
            <Body>
              <RegimenSchedule
                regimenPhases={regimen.regimenPhases}
                showDates={true}
                highlightedPhaseOrder={highlightedPhaseOrder}
              />
            </Body>
          </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>
            <AppText style={{flex: 4}}>Reminder</AppText>
            <Button small bordered style={{flex: 1}}
              onPress={this.didPressEditReminderBtn}
            ><AppText>Edit</AppText></Button>
          </CardItem>
          <CardItem>
            <ReminderSwitchersCard 
              reminderConfigs={reminderConfigs}
              didToggleReminder={this.toggleReminder}
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