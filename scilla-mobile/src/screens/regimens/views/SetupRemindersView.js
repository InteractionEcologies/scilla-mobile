// @flow
import React, { Component, Fragment } from "react";

import { AppText, Title, DotPageIndicator } from "../../../components";
import { Form, View, Row, Grid, Col, Input, Item, Label, Button } from "native-base";
import { Platform, StyleSheet } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Ionicons } from '@expo/vector-icons';
import { EditRemindersView } from "../../../components/EditRemindersView";

import { IRegimen, ReminderTypeOptions, ReminderTimeConstraintOptions,
  Utils, AlarmTime
} from "../../../libs/scijs";
import type { ReminderConfigObject } from "../../../libs/scijs";

import _ from "lodash";
import moment from "moment";

type Props = {
  regimen: IRegimen,
  updateReminderConfig: (id: string, config: ReminderConfigObject) => void,

  numStates?: ?number,
  currentStateIndex?: ?number
}

type State = {
  reminders: ReminderConfigObject[]
}

const initialState: State = {
  reminders: []
}


const SCOPE = "SetupRemindersView";

class SetupRemindersView extends Component<Props, State> {
  
  constructor(props: Props) {
    super(props);

    this.state = initialState;
  }

  componentWillMount() {
    this.setState({reminders: this.props.regimen.reminderConfigs});
  }

  updateReminderConfig = (reminderId: string, newConfig: ReminderConfigObject) => {
    const { regimen  } = this.props;
    regimen.setReminderConfig(reminderId, newConfig);
    this.setState({reminders: regimen.reminderConfigs});
  }

  render() {
    // console.log(SCOPE, "render");
    const { regimen, numStates, currentStateIndex } = this.props;
    const { reminders } = this.state;

    return (
      <View>
        <Title
        >Setup Reminders</Title>
        { (numStates && currentStateIndex) &&
          <DotPageIndicator 
            totalDots={numStates}
            activeDotIndex={currentStateIndex}
            dotColor='grey'
            activeDotColor='black'  

            style={{marginBottom: 10}}
          />              
        }
        <EditRemindersView
          updateReminderConfig={this.updateReminderConfig}
          reminders={reminders}
        />
      </View>
    )
  }
}


export default SetupRemindersView;