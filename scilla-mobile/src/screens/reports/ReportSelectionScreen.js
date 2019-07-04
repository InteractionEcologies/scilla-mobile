// @flow
import moment from "moment";
import _ from "lodash";
import XDate from "xdate";

import React from "react";
import { Container, Content, View, Button, Card, CardItem } from "native-base";
import { ScrollView } from "react-native";
import { AppText, Title } from "../../components";

import type {
  MeasurementType
} from "../../libs/scijs"

import { DateFormatISO8601, IRegimen } from "../../libs/scijs"; 

import AppStore from "../../services/AppStore";
import AppClock from "../../services/AppClock";
import styles from "./ReportStyles"; 
import { ScreenNames } from "../../constants/Screens";
import { OneWeekCalendar } from "../../components";

const appStore = new AppStore();
const appClock = new AppClock();
const DAILY_EVALUATION_MEASUREMENT_TYPE = "Daily Evaluation"

type State = {
  selectedDate: string, 
  trackedMeasurementTypes: MeasurementType[]
}

export default class ReportSelectionScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: 'Report'
  };

  state = {
    selectedDate: appClock.now().format(DateFormatISO8601),
    trackedMeasurementTypes: ['Mood', 'Daily Evaluation']
  }

  componentWillFocusSubscription: any;
  regimen: IRegimen;

  constructor(props: any) {
    super(props);
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    )
  }

  componentDidMount() {
    this.initializeState();
  }

  componentWillFocus = (payload: any) => {
    console.info("willFocus", payload);
    this.initializeState();
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  async initializeState() {
    try {
      let regimen = await appStore.getLatestRegimen();
      if(regimen) {
        this.regimen = regimen;
        this.setState({
          trackedMeasurementTypes: [
            ...regimen.getTrackedMeasurementTypes(),
            DAILY_EVALUATION_MEASUREMENT_TYPE
          ],
        });
      }
    } catch (e) {
      console.log(e.name);
    }
  }

  _goToMeasurementScreen = (type: string) => {
    this.props.navigation.navigate(
      ScreenNames.ReportMeasurement, 
      { trackedMeasurementType: type }
    )
  }

  _goToDailyEvaluationScreen = (date: string) => {
    this.props.navigation.navigate(
      ScreenNames.ReportDailyEvaluation,
      { selectedDate: date, regimen: this.regimen}
    )
  }

  onDayPressed = (day: XDate) => {
    this.setState({
      selectedDate: day.dateString
    })
  }

  render(){
    let { selectedDate } = this.state;
    let markedDates = {
      [selectedDate]: {
        selected: true
      }
    }

    return(
      <Container style={styles.container}>
        <View style={styles.header}>
            <OneWeekCalendar style={styles.calendarView}
              current={this.state.selectedDate}
              onDayPress={this.onDayPressed}
              markedDates={markedDates}
            />
        </View>
        <ScrollView>
          <Content contentContainerStyle={styles.content}>
              {this.renderReportCard()}
          </Content>
        </ScrollView>
      </Container>
    );
  }

  renderReportCard = () => {
    if(this._regimenExist()) {
      return (
        <Card style={styles.selectionCard}>
          <CardItem style = {styles.cardItems} bordered>
            <Title style={styles.titleText}>Report your experience</Title>   
          </CardItem>
          <CardItem style={styles.cardButtons} bordered>
            {this.renderInSituMeasurementTypeOptions()}    
          </CardItem>
          {this.renderDailyEvalCardItem()}
        </Card>
      )
    } else {
      return (
        <Card style={styles.selectionCard}>
          <CardItem style = {styles.cardItems}>
            <AppText>To report your experience, you have to create a regimen first.</AppText>   
          </CardItem>
        </Card>
      )
    }
  }

  _regimenExist = () => {
    // We will attach a daily evaluation to the options 
    // displayed to the user if a regimen exist. Thus if there 
    // is no reporting option that means a regimen does not exist. 
    if(this.state.trackedMeasurementTypes.length > 0) {
      return true
    } else {
      return false
    }
  }

  renderInSituMeasurementTypeOptions = () => {
    let optionButtons = _.map<any, any>(
      this.state.trackedMeasurementTypes,
      (type: string, i: number) => {
        console.log(type);
        if(type !== DAILY_EVALUATION_MEASUREMENT_TYPE) {
          return (
            <Button 
                key={i}
                style={styles.optionButton}
                bordered={true}
                block
                onPress={() => this._goToMeasurementScreen(type) }
            >
              <AppText>{type}</AppText>
            </Button>
          );  
        }
      })
    return optionButtons;
  }

  renderDailyEvalCardItem = () => {
    if(this.state.trackedMeasurementTypes.includes(DAILY_EVALUATION_MEASUREMENT_TYPE)) {
      return (
        <CardItem style = {styles.cardButtons} bordered>
          <Button 
              style={styles.optionButton}
              bordered={true}
              block
              onPress={() => this._goToDailyEvaluationScreen(this.state.selectedDate) }
          >
            <AppText>Daily Diary</AppText>
          </Button>
        </CardItem>
      )
    }
  }
}