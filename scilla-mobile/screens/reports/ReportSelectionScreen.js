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
          trackedMeasurementTypes: [...regimen.getTrackedMeasurementTypes(),'Daily Evaluation'],
        });
      }
    } catch (e) {
      console.log(e.name);
    }
  }

  _goToMeasurementScreen = (type:string) =>{
    this.props.navigation.navigate(
      ScreenNames.ReportMeasurement, 
      { trackedMeasurementType: type }
    )
  }

  _goToDailyEvaluationScreen = (date: string) =>{
    this.props.navigation.navigate(
      ScreenNames.ReportDailyEvaluation,
      { selectedDate: date }
    )
  }

  renderMeasurementTypeOptions = ():any =>{
    if(this.state.trackedMeasurementTypes){
      return this.state.trackedMeasurementTypes.map((type: string, i: number):any=>{
          return (
          <Button 
              key={i}
              style={styles.optionButton}
              bordered={true}
              block
              onPress={(type==='Daily Evaluation')? 
                        ()=>this._goToDailyEvaluationScreen(this.state.selectedDate)
                        :()=>this._goToMeasurementScreen(type) }
          >
              <AppText>{type}</AppText>
          </Button>
          );
      })
    }else{
      return(
        <AppText>No tracked measurement being set</AppText>
      );
    }
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
              <Card style={styles.selectionCard}>
                <CardItem style = {styles.cardItems} bordered>
                  <Title style={styles.titleText}>Report your experience</Title>   
                </CardItem>
                <CardItem style={styles.cardButtons}>
                  {this.renderMeasurementTypeOptions()}    
                </CardItem>
              </Card>              
            </Content>
          </ScrollView>
        </Container>
      );
    }

}
