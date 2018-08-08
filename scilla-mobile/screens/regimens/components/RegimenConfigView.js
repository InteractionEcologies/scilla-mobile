// @flow
import React from "react";
import { View, Text, Item, Input } from "native-base";
import type { RegimentOption } from "../../../libs/intecojs/types";
import { RegimenOptions } from "../../../libs/intecojs/types";

export default class RegimenConfigView extends React.Component<any, any> {
  state = {
    type: RegimenOptions.undefined,
    desc: ""
  }
  constructor(props: Object) {
    super(props);
    console.log(props);
  }
  componentDidMount() {
    console.log(this.props);
    
  }

  prepareDesc(type: RegimentOption): Text {
    switch(type) {
      case RegimenOptions.incBaclofen: {
        let desc = "In this regimen, you will experiment how increasing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness. " + 
          "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
        this.setState({desc: desc})
        break;
      }
      case RegimenOptions.decBaclofen: {
        let desc = "In this regimen, you will experiment how reducing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness. " + 
          "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
        this.setState({desc: desc});
        break;
      }
      case RegimenOptions.undefined: {
        let desc = "No type of regimen is selected.";
        this.setState({desc: desc});
        break;
      }
      default: {
        let desc = "No type of regimen is selected.";
        this.setState({desc: desc});
        break;
      }
    }
  }

  prepareConfigComps(): any {
    let type = this.props.type;
    switch(type) {
      case RegimenOptions.incBaclofen: {
        return (
          <View>
            <Item>
              <Input placeholder="Current Baclofen Dosage Per Day"/>
            </Item>
          </View>
        )
      }
      case RegimenOptions.decBaclofen: {
        return (
          <View>
            <Item>
              <Input placeholder="Current Baclofen Dosage Per Day"/>
            </Item>
          </View>
        )
      }
      case RegimenOptions.undefined: 
      default: 
        return null
      
    }
  }

  componentWillReceiveProps(nextProps: any, nextContext: any) {
    this.prepareDesc(nextProps.type);
  }

  componentWillUpdate(nextProps: any, nextState: any) {
    
  }

  componentDidUpdate(prevProps: any, prevState: any) {

  }

  render() {
    let type: RegimentOption = this.props.type;
    let view = this.prepareConfigComps();
    return (
      <View>
        <Text>{this.state.desc}</Text>
        {view}
      </View>
    )
  }
}