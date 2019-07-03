// @flow
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Container, Content } from "native-base"; 
import AppStore from "../../app/AppStore";
import {
  DateFormatTimeOfDay, 
  DateFormatISO8601,
} from "../../libs/scijs"
import type {
  ComplianceReportObject, 
  ComplianceStatus, 
  DateTypeISO8601
} from "../../libs/scijs"
import { Treatment } from "../../libs/scijs/models/regimen";
import TreatmentListView from "./views/TreatmentListView";
import moment from "moment";
import { ComplianceReportHelper } from "../../models/ComplianceReportHelper";
import { OneWeekCalendar } from "../../components";
import XDate from "xdate";
import AppClock from "../../app/AppClock";

const appStore: AppStore = new AppStore();
const appClock = new AppClock();

type State = {
  treatmentMap: {[treatmentId: string]: Treatment}, // key: id of treatment
  complianceReportMap: {[treatmentId: string]: ComplianceReportObject}, // key: id of treatment
  current: DateTypeISO8601
}
export default class DashboardMainScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: "Today"
  }
  
  state = {
    treatmentMap: {},
    complianceReportMap: {},
    current: appClock.now().format(DateFormatISO8601)
  }
  componentWillFocusSubscription: any;
  
  constructor(props: any) {
    super(props);
    // this.state.treatmentMap = new Map<string, Treatment>();
    // this.state.complianceReportMap = new Map<string, ComplianceReportObject>();
    this.state.current = appClock.now().format(DateFormatISO8601);
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    )
  }

  componentDidMount() {
    this.updateDate(this.state.current);
    appStore.initialize();
  } 

  componentWillFocus = (payload: any) => {
    this.updateDate(this.state.current);
  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  async updateDate(date: string) {
    try {
      let dateMoment = moment(date);
      let regimen = await appStore.getLatestRegimen();
      let treatments = regimen.getTreatmentsByDate(dateMoment);
      let complianceReports = await appStore.getOrInitComplianceReportsForDate(dateMoment);

      let treatmentMap = {};
      treatments.forEach( (treatment) => {
        treatmentMap[treatment.id] = treatment;
      })

      let complianceReportMap = {}
      complianceReports.forEach((report) =>  {
        complianceReportMap[report.treatmentId] = report;
      })

      this.setState({
        treatmentMap: treatmentMap,
        complianceReportMap: complianceReportMap
      })
    } catch (e) {
      if(e.name === "NotExistError") {
        console.log("Regimen does not exist.")
      }
    }
  }

  onDayPressed = (day: XDate) => {
    this.setState({
      current: day.dateString
    }, () => {
      this.updateDate(this.state.current);
    })
  }

  onTreatmentSkipped = (treatmentId: string) => {
    let report = this.state.complianceReportMap[treatmentId];
    let status = ComplianceReportHelper.toggleSkipAndGetNewStatus(report);
    this._updateComplianceCardStatus(treatmentId, status);
  }

  onTreatmentCompiled = (treatmentId: string) => {
    console.log(`Complied treatment: ${treatmentId}`);
    let report = this.state.complianceReportMap[treatmentId];
    let status = ComplianceReportHelper.toggleTakeAndGetNewStatus(report);
    this._updateComplianceCardStatus(treatmentId, status);
  }

  onTreatmentSnoozed = (treatmentId: string) => {
    console.log(`Snoozed treatment: ${treatmentId}`);
    let report = this.state.complianceReportMap[treatmentId];
    let timeUnix = ComplianceReportHelper.getNewSnoozeTime(report);
    this._updateComplianceCardTime(treatmentId, timeUnix);

  }

  _updateComplianceCardStatus(treatmentId: string, newStatus: ComplianceStatus) {
    let now = appClock.now().unix();
    this._updateComplianceCard(treatmentId, {
      status: newStatus,
      lastUpdatedAtTimestamp: now
    })
  }

  _updateComplianceCardTime(treatmentId: string, time: number) {
    let timeOfDay = moment.unix(time).format(DateFormatTimeOfDay);
    let now = appClock.now().unix();
    this._updateComplianceCard(treatmentId, {
      expectedTreatmentTime: timeOfDay,
      lastUpdatedAtTimestamp: now
    })

  }

  _updateComplianceCard(treatmentId: string, updateObj: Object) {
    this.setState( prevState => ({
      ...prevState,
      complianceReportMap: {
        ...prevState.complianceReportMap,
        [treatmentId]: {
          ...prevState.complianceReportMap[treatmentId],
          ...updateObj
        }
      }
    }), () => {
      appStore.updateComplianceReport(this.state.complianceReportMap[treatmentId]);
    })
  }

  render() {
    let { current } = this.state;
    let markedDates = {
      [current]: {
        selected: true
      }
    }
    
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <OneWeekCalendar style={styles.calendarView}
            current={this.state.current}
            onDayPress={this.onDayPressed}
            markedDates={markedDates}
          />
        </View>
        <Content contentContainerStyle={styles.content}>
          <ScrollView style={styles.mainView}>
            <TreatmentListView
              treatmentMap={this.state.treatmentMap}
              complianceReportMap={this.state.complianceReportMap}
              onTreatmentSkipped={this.onTreatmentSkipped}
              onTreatmentCompiled={this.onTreatmentCompiled}
              onTreatmentSnoozed={this.onTreatmentSnoozed}
            />
          </ScrollView>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  content: {
    flex: 1, 
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  header: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // height: 150,
    // padding: 10,
    paddingBottom: 3,
    shadowOffset: { width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: .3
  },
  calendarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    // marginBottom: 50,
    width: '100%'

  },
  mainView: {
    flex: 1,
    width: '90%'
     
  }
})