// @flow
import React, { Component, Fragment } from "react";

import moment from "moment";
import _ from "lodash";

import { IRegimen, DateFormatISO8601 } from "../../libs/scijs";
import type { DateTypeISO8601, DailyEvaluationObject } from "../../libs/scijs";

import { StyleSheet } from "react-native";
import { View, Spinner, Card, CardItem, Button } from "native-base";
import { Title, AppText } from "../../components";
import { Calendar } from "../../components/Calendar";

import AppClock from "../../services/AppClock";
import AppStore from "../../services/AppStore";
import Colors from "../../constants/Colors";
import { ScreenNames } from "../../constants/Screens";
import { DailyEvaluationsViewModel } from "../../viewModels/DailyEvaluationsViewModel";

const appClock = AppClock.instance;
const appStore = AppStore.instance;

type State = {
  regimen: ?IRegimen,
  isLoading: boolean,
  todayStr: DateTypeISO8601,
  selectedDateStr: ?DateTypeISO8601,
  dailyReports: DailyEvaluationObject[],
  markedDatesObj: Object // an array with key to be a date. 
}

const initialState = {
  regimen: null,
  isLoading: false,
  todayStr: appClock.now().format(DateFormatISO8601),
  selectedDateStr: appClock.now().format(DateFormatISO8601),
  dailyReports: [],
  markedDatesObj: {}
}

export default class ReportMainScreen extends Component<any, State> {

  constructor(props: any) {  
    super(props);

    this.state = initialState;
  }

  async componentWillMount() {

    this.setState({isLoading: true});
    let regimen = await appStore.getLatestRegimen();
    if (regimen) {
      this.setState({regimen: regimen});

      let startDate = regimen.startDate;
      let today = appClock.now();
      let endDate = today.isAfter(regimen.endDate, 'day') ? regimen.endDate : today;

      let dailyReports = await appStore.getDailyEvalsByDateRange(startDate, endDate);
      if(dailyReports) { 
        let vm = new DailyEvaluationsViewModel(dailyReports);
        this.setState({
          dailyReports: dailyReports,
          markedDatesObj: vm.getMarkedDatesObj(this.state.selectedDateStr)
        });

      } else {
        let vm = new DailyEvaluationsViewModel([]);

        this.setState({
          dailyReports: [],
          markedDatesObj: vm.getMarkedDatesObj(this.state.selectedDateStr)
        })
      }

    }
    this.setState({isLoading: false});
  }

  /**
   * Create makers for dates with daily reports,
   * the currently selected dates.
   */
  getMarkedDatesObject = (
    dailyReports: DailyEvaluationObject[],
    selectedDateStr: DateTypeISO8601
  ): Object => {
    let markedDates = {}
    _.forEach(dailyReports, (report: DailyEvaluationObject) => {
      markedDates[report.date] = {
          'dotColor': Colors.accentColor,
          'marked': true
      }
    });

    // Set the marker for the currently-selected date. 
    let selectedDateConfig = Object.assign({}, 
      // copy whatever properties if the user has already reported for the selected date. 
      markedDates[selectedDateStr], 
      {
        'selected': true
      }
    )
    markedDates[selectedDateStr] = selectedDateConfig;
    return markedDates;
  }

  selectDate = (date: Object) => {
    let dateStr = date.dateString;
    // this.setState({selectedDateStr: dateStr})
    let vm = new DailyEvaluationsViewModel(this.state.dailyReports);
    this.setState({
      selectedDateStr: dateStr,
      markedDatesObj: vm.getMarkedDatesObj(dateStr)
    })
  }

  onReportPressed = (evt: any) => {
    const { selectedDateStr } = this.state;
    this.props.navigation.navigate(ScreenNames.ReportDailyEvaluation, {
      selectedDate: selectedDateStr, 
      regimen: this.state.regimen
    });
  }

  render() {
    const { isLoading, regimen, selectedDateStr, markedDatesObj,
      todayStr
    } = this.state;

    let today = moment(todayStr);
    let maxDateStr;
    if (regimen) {
      let maxDate = today.isAfter(regimen.endDate) ? regimen.endDate : today;
      maxDateStr = maxDate.format(DateFormatISO8601);
    }
    return (
      <View style={styles.container}>
        {isLoading &&
          <Spinner 
            color={Colors.primaryColor}
          />
        }
        {!isLoading && !regimen &&
          <Card style={styles.content}>
            <AppText>You do not have a regimen yet. Please redeem one first.</AppText>
          </Card>
        }
        {!isLoading && !!regimen &&
          <Card style={styles.content}>
              <Title>Daily Report</Title>
              <AppText>Choose the date you want to report</AppText>
              <Calendar 
                // Initially visible month and the current selected date?  
                current={todayStr}
                minDate={regimen.startDate.format(DateFormatISO8601)}
                maxDate={maxDateStr}
                onDayPress={this.selectDate}
                markedDates={markedDatesObj}
                // markingType={'multi-dot'}

                style={{width: '100%'}}
              />
              <Button 
                full
                primary
                onPress={this.onReportPressed}
              >
                <AppText>Report</AppText>
              </Button>
          </Card>
        }
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: 10, 
    paddingRight: 10
  }, 
  content: {
    justifyContent: "flex-start",
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'red'
  },
  
  
})