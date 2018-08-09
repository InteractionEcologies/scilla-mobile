// @flow
import React from "react";
import { View, Text, Item, Input } from "native-base";
import type { RegimenType } from "../../../libs/intecojs";
import { RegimenTypes } from "../../../libs/intecojs";

export default class RegimenConfigView extends React.Component<any, any> {
  state = {
    type: RegimenTypes.undefined,
    desc: ""
  }
  constructor(props: Object) {
    super(props);
    console.log(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  renderDesc(type: RegimenType): Text {
    let desc: string = ""
    switch(type) {
      case RegimenTypes.incBaclofen: 
        desc = "In this regimen, you will experiment how increasing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness. " + 
          "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
        break;
      case RegimenTypes.decBaclofen: 
        desc = "In this regimen, you will experiment how reducing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness. " + 
          "This regimen will take 1-6 weeks depending on your current Baclofen intake.";
        break;
      default: 
        desc = "No type of regimen is selected.";
        break;
    }
    
    return (
      <Text>{desc}</Text>
    )
  }

  renderParamView(type: RegimenType): any {
    let placeholder: string = ""
    switch(type) {
      case RegimenTypes.incBaclofen: 
      case RegimenTypes.decBaclofen: 
        placeholder = "Current Baclofen Dosage Per Day (mg)";
        break;
      default: 
        placeholder = "";
        break;
    }
    
    return (
        <Item>
          <Input placeholder={placeholder} />
        </Item>
    )
  }

  render() {
    let type: RegimenType = this.props.type;
    const paramView = this.renderParamView(type);
    const textDesc = this.renderDesc(type);
    return (
      <View>
        {textDesc}
        {paramView}
      </View>
    )
  }
}