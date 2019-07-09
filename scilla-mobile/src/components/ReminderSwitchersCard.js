// @flow
import React, { Component, Fragment } from "react"
import type { ReminderConfigObject } from "../libs/scijs";

import { View } from "native-base";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  
  didToggleReminder: (e: any) => void,

  [key: string]: any

}

class ReminderSwitcher extends Component<ReminderSwitcherProps, any> {

  render() {
    const { time, enabled, visible } = this.props;
    return (
      <View style={styles.switch}>
        {visible &&
          <Fragment>
            {enabled &&
              <MaterialCommunityIcons
                size={30}
                name="bell-outline"
                onPress={ this.props.didToggleReminder }
              />
            }
            {!enabled &&
              <MaterialCommunityIcons
              size={30}
              name="bell-off-outline"
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
  didToggleReminder: (reminderSlotId: string) => void
}
export default class ReminderSwitchersCard extends Component<ReminderSwitchersCardProps, any> {

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
    
    return _.map<ReminderConfigObject, any>(reminderConfigs, (config: ReminderConfigObject) => {
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

