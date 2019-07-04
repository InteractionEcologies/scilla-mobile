// @flow
import React, { Component, Fragment } from "react"
import type { ReminderConfigObject } from "../libs/scijs";

import { View } from "native-base";
import { Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../components";
import { AlarmTime } from "../libs/scijs";

import _ from "lodash";

import AppClock from "../services/AppClock";
const appClock = AppClock.instance;

type ReminderSwitcherProps = {
  reminderId: string,
  time: string, // h:mm a
  enabled: boolean, // The state of the reminder
  visible: boolean, // some phases do not require all the reminders. 
  
  didToggleReminder: (reminderSlotId: string) => {},

  [key: string]: any

}

class ReminderSwitcher extends Component<any, any> {

  render() {
    const { time, enabled, visible, reminderId } = this.props;
    return (
      <View style={styles.switch}>
        {visible &&
          <Fragment>
            {enabled &&
              <Ionicons
                size={30}
                name={
                  Platform.OS === "ios"
                  ? "ios-notifications-outline" 
                  : "md-notifications-outline"
                }
                onPress={ this.props.didToggleReminder }
              />
            }
            {!enabled &&
              <Ionicons
              size={30}
              name={
                Platform.OS === "ios"
                ? "ios-notifications-off" 
                : "md-notifications-off"
              }
              onPress={ this.props.didToggleReminder }
            />
            }
            <AppText>
              {time}
            </AppText>
          </Fragment>
        }
        
      </View>
    )
  }
}

type ReminderSwitchersCardProps = {
  reminderConfigs: ReminderConfigObject[],
  didToggleReminder: (reminderSlotId: string) => {}
}
export default class ReminderSwitchersCard extends Component<any, any> {

  render() {
    return (
      <View style={styles.switchers}>
        {this._renderReminderSwitchers()}    
      </View>
    )
  }

  _renderReminderSwitchers() {
    const { reminderConfigs } = this.props;
    const { didToggleReminder } = this.props;
    
    return _.map<any, any>(reminderConfigs, (config) => {
      const time = new AlarmTime(config.time, appClock.now());
      const timeStr = time.toMoment().format("h:mm a");
      return (
        <ReminderSwitcher key={config.id}
          reminderId={config.reminderSlotId}
          enabled={config.enabled}
          visible={true}
          time={timeStr}
          didToggleReminder={ (e) => { didToggleReminder(config.id) }}
        />
      )
    });
  }
}

const styles = StyleSheet.create({
  switchers: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: "space-between",
    alignItems: 'flex-start'
  },
  switch: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});

