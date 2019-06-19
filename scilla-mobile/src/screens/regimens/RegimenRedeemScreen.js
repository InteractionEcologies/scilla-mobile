// @flow
import React, { Component } from "react";
import styles from "./RegimenStyles";
import { View } from "react-native";
import { Action, withStateMachine } from "react-automata";
import InputCodeView from "./views/InputCodeView";
import { Card, CardItem, Content } from "native-base";


const StateNames = {
  inputCode: 'inputCode'
}

const StateMachine = {
  initial: StateNames.inputCode,
  states: {
    [StateNames.inputCode]: {
      onEntry: StateNames.inputCode
    }
  }
}

const customStyles = {
  content: {
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'red',
    width: '50%'
  },
  card: {
    marginLeft: 10, 
    marginRight: 10,
    width: '50%',
    backgroundColor: 'red'
  }
}

class RegimenRedeemScreen extends Component<any, any> {

  render() {
    return (
      <Content>
        <Card styles={customStyles.card}>
          <CardItem>
            <Action is={StateNames.inputCode}>
              <InputCodeView />
            </Action>
          </CardItem>
        </Card>
      </Content>
    )
  }
}

export default withStateMachine(StateMachine)(RegimenRedeemScreen);