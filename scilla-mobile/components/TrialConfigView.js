// @flow
import React from "react";
import { View, Text, Item, Input } from "native-base";
import type { TYTrialType } from "../libs/intecojs/types";
import { TrialTypes } from "../libs/intecojs/types";

export default class TrialConfigView extends React.Component<any, any> {
  state = {
    desc: ""
  }
  constructor(props: Object) {
    super(props);
    console.log(props);
  }
  componentDidMount() {
    console.log(this.props);
    this.prepareDesc();
  }

  prepareDesc(): Text {
    let type = this.props.type;
    switch(type) {
      case TrialTypes.incBaclofen: {
        let desc = "In this trial, you will experiment how increasing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness. " + 
          "This trial will take 1-6 weeks depending on your current Baclofen intake.";
        this.setState({desc: desc})
        break;
      }
      case TrialTypes.decBaclofen: {
        let desc = "In this trial, you will experiment how reducing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness. " + 
          "This trial will take 1-6 weeks depending on your current Baclofen intake.";
        this.setState({desc: desc});
        break;
      }
      case TrialTypes.none: {
        let desc = "No type of trial is selected.";
        this.setState({desc: desc});
        break;
      }
      default: {
        let desc = "No type of trial is selected.";
        this.setState({desc: desc});
        break;
      }
    }
  }

  prepareConfigComps(): any {
    let type = this.props.type;
    switch(type) {
      case TrialTypes.incBaclofen: {
        return (
          <View>
            <Item>
              <Input placeholder="Current Baclofen Dosage Per Day"/>
            </Item>
          </View>
        )
      }
      case TrialTypes.decBaclofen: {
        return (
          <View>
            <Item>
              <Input placeholder="Current Baclofen Dosage Per Day"/>
            </Item>
          </View>
        )
      }
      case TrialTypes.none: 
      default: 
        return null
      
    }
  }

  render() {
    let type: TYTrialType = this.props.type;
    let view = this.prepareConfigComps();

    return (
      <View>
        <Text>{this.state.desc}</Text>
        {view}
      </View>
    )
  }
}