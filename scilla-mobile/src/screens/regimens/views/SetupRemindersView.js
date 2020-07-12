// @flow
import React, { Component } from "react";

import { Title, DotPageIndicator } from "../../../components";
import { View} from "native-base";
import { EditRemindersView } from "../../../components/EditRemindersView";

import { IRegimen } from "../../../libs/scijs";
import type { ReminderConfigObject } from "../../../libs/scijs";


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


// eslint-disable-next-line no-unused-vars
const SCOPE = "SetupRemindersView";

class SetupRemindersView extends Component<Props, State> {
  
  constructor(props: Props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    this.setState({reminders: this.props.regimen.reminderConfigs});
  }

  updateReminderConfig = (reminderId: string, newConfig: ReminderConfigObject) => {
    console.log(SCOPE, "updateReminderConfig")
    const { regimen  } = this.props;
    regimen.setReminderConfig(reminderId, newConfig);
    this.setState({reminders: regimen.reminderConfigs});
  }

  render() {
    // console.log(SCOPE, "render");
    const { numStates, currentStateIndex } = this.props;
    const { reminders } = this.state;

    return (
      <View>
        <Title
        >Setup Reminders</Title>
        { (numStates && currentStateIndex) &&
          <DotPageIndicator 
            totalDots={numStates}
            activeDotIndex={currentStateIndex}
            // dotColor='grey'
            // activeDotColor='black'  

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