// @flow
import React from "react";
import { Container, Content, Text, View, Icon, Button, Card, CardItem, Body } from "native-base";
import { ScrollView } from "react-native";
import { AppText, Title, DotPageIndicator } from "../../components";
import moment from "moment";
import AppState from "../../app/AppState";
import { MeasurementTypes, DateFormatISO8601 } from "../../libs/intecojs"; 
import styles from "./ReportStyles"; 
import { ScreenNames } from "../../constants/Screens";
import _ from "lodash";
import { OneWeekCalendar } from "../../components";
import XDate from "xdate";
import type {
  MeasurementType
} from "../../libs/intecojs"

const appState = new AppState();
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
    selectedDate: moment().format(DateFormatISO8601),
    trackedMeasurementTypes: []
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
      let regimen = await appState.getLatestRegimen();
      if(regimen) {
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
      { selectedDate: date }
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
          <CardItem style={styles.cardButtons}>
            {this.renderMeasurementTypeOptions()}    
          </CardItem>
        </Card>
      )
    } else {
      return (
        <Card style={styles.selectionCard}>
          <CardItem style = {styles.cardItems} bordered>
            <Title>To report your experience, you have to first setup a regimen.</Title>   
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

  renderMeasurementTypeOptions = () => {
    let optionButtons = _.map(
      this.state.trackedMeasurementTypes,
      (type: string, i: number) => {
        console.log(type);
        return (
          <Button 
              key={i}
              style={styles.optionButton}
              bordered={true}
              block
              onPress={ (type === DAILY_EVALUATION_MEASUREMENT_TYPE) ? 
                        () => this._goToDailyEvaluationScreen(this.state.selectedDate)
                        :() => this._goToMeasurementScreen(type) }
          >
            <AppText>{type}</AppText>
          </Button>
        );
      })
    
    return optionButtons;
  }
}