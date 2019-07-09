// @flow
import _ from "lodash";
import XDate from "xdate";
import React, { Fragment } from "react";
import { 
  Button, Card, CardItem,
  Spinner
} from "native-base";
import { ScrollView } from "react-native";
import { AppText } from "../../components";

import type {
  MeasurementType
} from "../../libs/scijs"

import { DateFormatISO8601, IRegimen, MeasurementTypes } from "../../libs/scijs"; 

import AppStore from "../../services/AppStore";
import AppClock from "../../services/AppClock";
import styles from "./ReportStyles"; 
import { ScreenNames } from "../../constants/Screens";
import Colors from "../../constants/Colors";

const appStore = new AppStore();
const appClock = new AppClock();
const DAILY_EVALUATION_MEASUREMENT_TYPE = "Daily Evaluation"

type State = {
  selectedDate: string, 
  trackedMeasurementTypes: MeasurementType[],
  isLoading: boolean
}

export default class ReportSelectionScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: 'Memo'
  };

  state = {
    selectedDate: appClock.now().format(DateFormatISO8601),
    trackedMeasurementTypes: [],
    isLoading: false
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

  async componentDidMount() {
    this.setState({isLoading: true})
    await this.initializeState();
    this.setState({isLoading: false})
  }

  componentWillFocus = (payload: any) => {
    console.info("willFocus", payload);
    this.initializeState();
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  async initializeState() {
    
    let regimen = await appStore.getLatestRegimen();
    if(regimen) {
      this.regimen = regimen;
      this.setState({
        trackedMeasurementTypes: [
          ...regimen.getTrackedMeasurementTypes(),
          MeasurementTypes.memo
        ],
      });
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
    let { isLoading } = this.state;

    return(
      <ScrollView contentContainerStyle={styles.content}>
        {/* <View style={styles.header}>
            <OneWeekCalendar style={styles.calendarView}
              current={this.state.selectedDate}
              onDayPress={this.onDayPressed}
              markedDates={markedDates}
            />
        </View> */}
        {!isLoading &&
          this.renderReportCard()
        }
        {isLoading &&
          <Spinner 
            color={Colors.primaryColor}
          />
        }
        
      </ScrollView>
    );
  }

  renderReportCard = () => {
    if(this._regimenExist()) {
      return (
        // <Card style={styles.selectionCard}>
          // <CardItem style={styles.cardButtons} bordered>
          <Fragment>
            {this.renderInSituMeasurementTypeOptions()}    
          </Fragment>
          // </CardItem>
        // </Card>
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
    let optionButtons = [];

    let types = Array.from(this.state.trackedMeasurementTypes);
    
    _.forEach(
      types,
      (type: string, i: number) => {
        console.log(type);
        if(type !== DAILY_EVALUATION_MEASUREMENT_TYPE) {
          optionButtons.push(
            <Button 
                key={i}
                style={styles.optionButton}
                full
                onPress={() => this._goToMeasurementScreen(type) }
            >
              <AppText>{type}</AppText>
            </Button>
          );  
        }
      }
    )
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