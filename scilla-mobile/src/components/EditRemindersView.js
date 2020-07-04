// @flow
import React, { Component, Fragment } from "react";
import { StyleSheet } from "react-native";

import { View, Button } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReminderConfigObject } from "../libs/scijs";
import { AlarmTime, Utils, ReminderTypeOptions } from "../libs/scijs"; 
import { AppText } from "./StyledText";
import DateTimePicker from '@react-native-community/datetimepicker';

import _ from "lodash";
import moment from "moment";

type Props = {
  reminders: ReminderConfigObject[],
  updateReminderConfig: (id: string, config: ReminderConfigObject) => void,
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

// eslint-disable-next-line no-unused-vars
const SCOPE = "EditRemindersView";

export class EditRemindersView extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = initialState;
  }

  onTimePickerDismissed = () => {
    this.setState({
      isTimePickerVisible: false
    });
  }

  selectReminderConfig = (id: string) => {
    // console.log(SCOPE, "Select reminder config:", id);
    const { reminders } = this.props;
    // find the config 
    let foundConfig = _.find<any, any>(reminders, (config) => {
      // console.log("target: ", id.toString(), "compared to: ", config.id.toString());
      return id.toString() === config.id.toString();
    })

    // console.log(SCOPE, "foundConfig", foundConfig);

    if(foundConfig) {
      let alarmTime = new AlarmTime(foundConfig.time);
      this.setState({
        selectedReminderId: id,
        timePickerTime: alarmTime.toMoment().toDate(),
        isTimePickerVisible: true
      });
    }
  }

  handleTimePicked = (event: any, time: any) => {
    const { selectedReminderId } = this.state;
    const { reminders } = this.props;

    // console.log(SCOPE, "selected reminder id:", selectedReminderId);
    // Find the associated reminder config
    let foundConfig = _.find(reminders, (config) => {
      return config.id === selectedReminderId;
    })
    
    // console.log(SCOPE, "foundConfig", foundConfig);

    if(foundConfig) {
      foundConfig.time = moment(time).format("HH:mm");
      this.props.updateReminderConfig(foundConfig.id, foundConfig);
    }

    this.setState({
      isTimePickerVisible: false
    });

    // console.log("Picked time:", time);
  }

  toggleReminder = (id: string) => {
    // console.log(SCOPE, "toggle reminder", id);
    const { reminders } = this.props;

    let foundConfig = _.find(reminders, (config) => {
      return id === config.id;
    });

    if (foundConfig) {
      foundConfig.enabled = !foundConfig.enabled;
      this.props.updateReminderConfig(foundConfig.id, foundConfig);
    }
  }

  render() {
    const { isTimePickerVisible, timePickerTime } = this.state;
    return (
      <View style={customStyles.main}>
        <View style={customStyles.headerRow}>
          <AppText style={customStyles.headerText}>
            Medicine Intake
          </AppText>
        </View>
        {this._renderReminderConfigs(true)}
        <View style={customStyles.headerRow}>
          <AppText style={[customStyles.headerText, {marginTop: 0}]}>
            Daily Evaluation
          </AppText>
        </View>
        {this._renderReminderConfigs(false)}
        <DateTimePicker
          mode="time"
          value={timePickerTime}
          
          isVisible={isTimePickerVisible}
          is24Hour={false}
          // onCancel={this.onTimePickerDismissed}
          // onConfirm={this.handleTimePicked}
          onChange={this.handleTimePicked}
        />
      </View>
    )
  }


  _renderReminderConfigs = (forTreatment: boolean = true) => {
    const { reminders } = this.props;
    
    // sort by order
    let _reminders = _.sortBy<any, any>(reminders, (config) => {
      return config.order;
    })

    let configViews = _.map<ReminderConfigObject, any>(_reminders, (config: ReminderConfigObject) => {
      
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
            <View style={customStyles.reminderRow}>
              <View style={{flex: 2}}>
                <AppText style={customStyles.labelText}>{timeConstraintStr}</AppText>
              </View>
              <View style={{flex: 2}}>
                <Button 
                  bordered
                  style={customStyles.inputText}
                  onPress={ (e) => this.selectReminderConfig(config.id) }
                >
                  <AppText>{timeStr}</AppText>
                </Button>
              </View>
              <View style={{flex: 1}}>
                <Button
                  transparent
                  onPress={(e) => this.toggleReminder(config.id)}
                >
                {config.enabled &&
                  <MaterialCommunityIcons 
                  size={30}
                  name="bell-outline"
                  />
                }

                {!config.enabled &&
                  <MaterialCommunityIcons 
                  size={30}
                  name="bell-off-outline"/>
                }
                </Button>
              </View>
            </View>
            }

            { !forTreatment &&
            <View style={customStyles.reminderRow}>
              <View style={{flex: 2}}>
                <AppText style={customStyles.labelText}>{timeConstraintStr}</AppText>
              </View>
              <View style={{flex: 2}}>
                <Button 
                  bordered
                  style={customStyles.inputText}
                  onPress={ (e) => this.selectReminderConfig(config.id) }
                >
                  <AppText>{timeStr}</AppText>
                </Button>
              </View>
              <View style={{flex: 1}}>
                <Button transparent
                  onPress={(e) => this.toggleReminder(config.id)}>
                  {config.enabled &&
                    <MaterialCommunityIcons 
                    size={30}
                    name="bell-outline"/>
                  }

                  {!config.enabled &&
                    <MaterialCommunityIcons 
                    size={30}
                    name="bell-off-outline"/>
                  }
                  </Button>                    
                </View>
          </View>
            }
          </Fragment>
        
      )
    })

    return configViews;
  }
}


const customStyles = StyleSheet.create({
  main: {
    // flex: 1,
    width: '100%',
    // backgroundColor: 'green',
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerRow: {
    // flex: 1, 
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    marginBottom: 10
  },
  reminderRow: {
    // flex: 1, 
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'blue',
    marginBottom: 10
  },
  reminderItem: {
    flex: 1
  },  
  headerText: {
    textAlign: 'center',
    marginBottom: 10,
    // backgroundColor: 'red'
  }, 
  labelText: {
    // alignItems: 'center', 
    textAlign: 'right',
    paddingRight: 10,
    paddingTop: 10,
    // backgroundColor: 'red',
    // justifyContent: 'center',
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