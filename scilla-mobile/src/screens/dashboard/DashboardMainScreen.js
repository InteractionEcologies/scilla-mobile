// @flow
import React from "react";
import { View, StyleSheet, ScrollView, Spinner } from "react-native";
import { Container, Content, Fab } from "native-base"; 
import AppStore from "../../services/AppStore";
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
import AppClock from "../../services/AppClock";
import AppInitializer from "../../services/AppInitializer";
import { SimpleLineIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { ScreenNames } from "../../constants/Screens";

const appStore: AppStore = new AppStore();
const appClock = new AppClock();
const appInitializer = new AppInitializer();

type State = {
  treatmentMap: {[treatmentId: string]: Treatment}, // key: id of treatment
  complianceReportMap: {[treatmentId: string]: ComplianceReportObject}, // key: id of treatment
  selectedDateStr: DateTypeISO8601,
  todayDateStr: DateTypeISO8601,
  
  // control whether to show treatments/compliance reports
  // if it is a future date, should show a disabled version of treatments. 
  showTreatments: boolean,
  isLoading: boolean
}

const initialState: State = {
  treatmentMap: {},
  complianceReportMap: {},
  selectedDateStr: appClock.now().format(DateFormatISO8601),
  todayDateStr: appClock.now().format(DateFormatISO8601),
  showTreatments: false,
  isLoading: false
}

const SCOPE = "DashboardMainScreen";
export default class DashboardMainScreen extends React.Component<any, State> {
  _isInitializedOnce = false

  static navigationOptions: any = {
    title: "Today"
  }
  
  componentWillFocusSubscription: any;
  
  constructor(props: any) {
    super(props);
    // this.state.treatmentMap = new Map<string, Treatment>();
    // this.state.complianceReportMap = new Map<string, ComplianceReportObject>();
    this.state = initialState;
    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    )
  }

  componentDidMount() {
    appInitializer.onMainScreenLoaded();
    appStore.initialize();
  } 

  componentWillFocus = (payload: any) => {
    let today = appClock.now();
    this.setState({todayDateStr: today.format(DateFormatISO8601)});
    this.updateTreatmentsByDate(this.state.selectedDateStr);  

  }

  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  async updateTreatmentsByDate(date: string) {
    try {
      let selectedDate = moment(date);
      let today = appClock.now();
      let regimen = await appStore.getLatestRegimen();

      // Prepare treatments information
      let treatments = regimen.getTreatmentsByDate(selectedDate);
      let treatmentMap = {};
      treatments.forEach( (treatment) => {
        treatmentMap[treatment.id] = treatment;
      })

      // Prepare compliance reports
      // If a future date is selected, we won't create any compliance reports
      // for this date, as the report may still change. 
      // FIXME: But even compliance reports for today can change. Increase dosage or
      // decrease dosage will change the report for today
      let complianceReportMap = {}
      let complianceReports = [];
      if(selectedDate.isSameOrBefore(today)) {
        complianceReports = await appStore.getOrInitComplianceReportsForDate(selectedDate);
      } else {
      }
      
      complianceReports.forEach((report) =>  {
        complianceReportMap[report.treatmentId] = report;
      })

      this.setState({
        treatmentMap: treatmentMap,
        complianceReportMap: complianceReportMap
      });

    } catch (e) {
      if(e.name === "NotExistError") {
        console.log(SCOPE, "Regimen does not exist.")
      }
    }
  }

  didPressReportBtn = () => {
    console.log(SCOPE, "didPressReportBtn");
    this.props.navigation.navigate(ScreenNames.ReportSelection);
  }

  onDayPressed = (day: XDate) => {
    this.setState({
      selectedDateStr: day.dateString
    }, () => {
      this.updateTreatmentsByDate(this.state.selectedDateStr);
    })
  }

  onTreatmentSkipped = (treatmentId: string) => {
    let report = this.state.complianceReportMap[treatmentId];
    let status = ComplianceReportHelper.toggleSkipAndGetNewStatus(report);
    this._updateComplianceCardStatus(treatmentId, status);
  }

  onTreatmentCompiled = (treatmentId: string) => {
    console.log(SCOPE, `Complied treatment: ${treatmentId}`);
    let report = this.state.complianceReportMap[treatmentId];
    let status = ComplianceReportHelper.toggleTakeAndGetNewStatus(report);
    this._updateComplianceCardStatus(treatmentId, status);
  }

  onTreatmentSnoozed = (treatmentId: string) => {
    console.log(SCOPE, `Snoozed treatment: ${treatmentId}`);
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
    let { selectedDateStr } = this.state;
    let markedDates = {
      [selectedDateStr]: {
        selected: true
      }
    }
    
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <OneWeekCalendar style={styles.calendarView}
            current={this.state.selectedDateStr}
            onDayPress={this.onDayPressed}
            markedDates={markedDates}
          />
        </View>
        

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.mainView}>
            <TreatmentListView
              treatmentMap={this.state.treatmentMap}
              complianceReportMap={this.state.complianceReportMap}
              onTreatmentSkipped={this.onTreatmentSkipped}
              onTreatmentCompiled={this.onTreatmentCompiled}
              onTreatmentSnoozed={this.onTreatmentSnoozed}
            />
          </View>
          
        </ScrollView>
        <Fab
          style={{backgroundColor: Colors.accentColor}}
          onPress={this.didPressReportBtn}
        >
          <SimpleLineIcons 
            name="pencil"
          />
        </Fab>  
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  content: {
    // Use flexGrow instead of flex to make the content
    // scrollable to the bottom. 
    // See: https://medium.com/@peterpme/taming-react-natives-scrollview-with-flex-144e6ff76c08
    flexGrow: 1, 
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'red',
    // height: 600,
  },
  mainView: {
    // flex: 1,
    width: '100%',
    paddingRight: 10, 
    paddingLeft: 10,
    // backgroundColor: 'yellow'
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
})