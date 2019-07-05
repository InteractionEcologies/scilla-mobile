// @flow
import React, { Component, Fragment } from "react";

import { AppText, Title, DotPageIndicator } from "../../../components";
import { Form, View, Row, Grid, Col, Input, Item, Label, Button } from "native-base";
import { Platform, StyleSheet } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

import { IRegimen, ReminderTypeOptions, ReminderTimeConstraintOptions,
  Utils, AlarmTime
} from "../../../libs/scijs";
import type { ReminderConfigObject } from "../../../libs/scijs";
import _ from "lodash";
import moment from "moment";
import { Ionicons } from '@expo/vector-icons';
import styles from "../../reports/ReportStyles";

type Props = {
  regimen: IRegimen,
  updateReminderConfig: (id: string, config: ReminderConfigObject) => void,

  numStates?: ?number,
  currentStateIndex?: ?number
}

type State = {
  isTimePickerVisible: boolean,
  selectedReminderId: string,
  timePickerTime: Date
}

const initialState: State = {
  isTimePickerVisible: false, 
  timePickerTime: new Date(),
  selectedReminderId: ''
}

const customStyles = StyleSheet.create({
  view: {
    width: '100%'
  },
  subheaderText: {
    textAlign: 'center',
    marginTop: 10,
  }, 
  labelText: {
    // alignItems: 'center', 
    textAlign: 'right',
    paddingRight: 10,
    paddingTop: 10,
    // backgroundColor: 'red',
    justifyContent: 'center',
    flex: 1,
    height: 40
  },
  inputText: {
    // backgroundColor: 'blue',
    height: 40,
    // width: 100
    width: '90%'
  },
  reminderIcon: {
    height: 40, 
    width: 40
  }
});

const SCOPE = "SetupRemindersView";

class SetupRemindersView extends Component<Props, State> {
  
  constructor(props: Props) {
    super(props);

    this.state = initialState;
  }

  selectReminderConfig = (id: string) => {
    console.log(SCOPE, "Select reminder config:", id);
    const { regimen } = this.props;

    // find the config 
    let foundConfig = _.find<any, any>(regimen.reminderConfigs, (config) => {
      console.log("target: ", id.toString(), "compared to: ", config.id.toString());
      return id.toString() === config.id.toString();
    })

    console.log(SCOPE, "foundConfig", foundConfig);

    if(foundConfig) {
      let alarmTime = new AlarmTime(foundConfig.time);
      this.setState({
        selectedReminderId: id,
        timePickerTime: alarmTime.toMoment().toDate(),
        isTimePickerVisible: true
      });

    }
  }

  onTimePickerDismissed = () => {
    this.setState({
      isTimePickerVisible: false
    });
  }

  handleTimePicked = (time: any) => {
    const { selectedReminderId } = this.state;
    const { regimen } = this.props;

    console.log(SCOPE, "selected reminder id:", selectedReminderId);
    // Does find returns a reference?
    let foundConfig = _.find(regimen.reminderConfigs, (config) => {
      return config.id === selectedReminderId;
    })
    
    console.log(SCOPE, "foundConfig", foundConfig);

    if(foundConfig) {
      foundConfig.time = moment(time).format("HH:mm");
      this.props.updateReminderConfig(foundConfig.id, foundConfig);
    }

    this.setState({
      isTimePickerVisible: false
    });

    console.log("Picked time:", time);

    // 
    this.forceUpdate();
  }

  toggleReminder = (id: string) => {
    console.log(SCOPE, "toggle reminder", id);
    const { regimen } = this.props;
    let foundConfig = _.find(regimen.reminderConfigs, (config) => {
      return id === config.id;
    });

    if (foundConfig) {
      foundConfig.enabled = !foundConfig.enabled;

      regimen.setReminderConfig(id, foundConfig);
    }

    this.forceUpdate();
  }

  
  render() {
    // console.log(SCOPE, "render");
    const { regimen, numStates, currentStateIndex } = this.props;
    const { isTimePickerVisible, timePickerTime } = this.state;

    let configs = regimen.reminderConfigs;

    return (
      <Fragment>
        <Title>Setup Reminders</Title>
        { (numStates && currentStateIndex) &&
          <DotPageIndicator 
            totalDots={numStates}
            activeDotIndex={currentStateIndex}
            dotColor='grey'
            activeDotColor='black'  
          />              
        }
        <Grid style={customStyles.view}>
          <Row>
            <Col>
              <AppText style={customStyles.subheaderText}>
                Medicine Intake
              </AppText>
            </Col>
          </Row>
          {this._renderReminderConfigs(true)}
          {this._renderReminderConfigs(false)}
          
        </Grid>
        <DateTimePicker
          isVisible={isTimePickerVisible}
          is24Hour={false}
          mode="time"
          date={timePickerTime}
          onCancel={this.onTimePickerDismissed}
          onConfirm={this.handleTimePicked}
        />
      </Fragment>
    )
  }


  _renderReminderConfigs = (forTreatment: boolean = true) => {
    const { regimen } = this.props;
    let configs = regimen.reminderConfigs;
    console.log(SCOPE, "_renderReminderConfigs", configs);
    
    // sort by order
    configs = _.sortBy<any, any>(configs, (config) => {
      return config.order;
    })

    let configViews = _.map<ReminderConfigObject, any>(configs, (config: ReminderConfigObject) => {
      
      if (forTreatment) {
        if (config.type === ReminderTypeOptions.dailyEval) return;
      } else { // daily evaluation
        if (config.type === ReminderTypeOptions.treatment) return;
      }
      
      let timeConstraintStr = Utils.capitalize(config.timeConstraint);
      let time = new AlarmTime(config.time).toMoment();
      let timeStr = time.format("h:mm a");

      return (
          <Fragment key={config.id}>
            { forTreatment &&
            <Row style={{marginTop: 20}}>
              <Col size={2}>
                <AppText style={customStyles.labelText}>{timeConstraintStr}</AppText>
              </Col>
              <Col size={2}>
                <Button 
                  bordered
                  style={customStyles.inputText}
                  onPress={ (e) => this.selectReminderConfig(config.id) }
                >
                  <AppText>{timeStr}</AppText>
                </Button>
              </Col>
              <Col size={1}>
                <Button
                  transparent
                  onPress={(e) => this.toggleReminder(config.id)}
                >
                {config.enabled &&
                  <Ionicons 
                  size={30}
                  name={
                    Platform.OS === "ios" 
                    ? "ios-notifications-outline" 
                    : "md-notifications-outline"
                  }/>
                }

                {!config.enabled &&
                  <Ionicons 
                  size={30}
                  name={
                    Platform.OS === "ios" 
                    ? "ios-notifications-off" 
                    : "md-notifications-off"
                  }/>
                }
                </Button>
              </Col>
            </Row>
            }

            { !forTreatment &&
            <Fragment>
                  <Row key="daily-eval" style={{marginTop: 20}}>
                    <Col>
                      <AppText style={[customStyles.subheaderText, {marginTop: 20}]}>
                        Daily Evaluation
                      </AppText>
                    </Col>
                  </Row>
                  <Row key={config.id} style={{marginTop: 20}}>
                    <Col size={2}>
                      <AppText style={customStyles.labelText}>{timeConstraintStr}</AppText>
                    </Col>
                    <Col size={2}>
                      <Button 
                        bordered
                        style={customStyles.inputText}
                        onPress={ (e) => this.selectReminderConfig(config.id) }
                      >
                        <AppText>{timeStr}</AppText>
                      </Button>
                    </Col>
                    <Col size={1}>
                      <Button transparent
                        onPress={(e) => this.toggleReminder(config.id)}>
                        {config.enabled &&
                          <Ionicons 
                          size={30}
                          name={
                            Platform.OS === "ios" 
                            ? "ios-notifications-outline" 
                            : "md-notifications-outline"
                          }/>
                        }

                        {!config.enabled &&
                          <Ionicons 
                          size={30}
                          name={
                            Platform.OS === "ios" 
                            ? "ios-notifications-off" 
                            : "md-notifications-off"
                          }/>
                        }
                        </Button>                    
                      </Col>
                </Row>
              </Fragment>
            }
          </Fragment>
        
      )
    })

    return configViews;
  }

}

export default SetupRemindersView;