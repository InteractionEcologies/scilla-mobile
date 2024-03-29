// @flow
import React from "react";
import { AppText } from "../../../components";
import Colors from "../../../constants/Colors";
import type {
  MeasurementType
} from "../../../libs/scijs";
import { 
  ColorsForMeasurementTypes, 
  DefaultColorForMeasurement 
} from "../constants";
import { Button } from "native-base";
import _ from "lodash";

type Props = { 
  measurementType: MeasurementType,
  selected: bool,
  [other: string]: any
}

export class MeasurementSelectionBtn extends React.Component<Props, any> {
  render() {
    let additionalStyle = this._addAdditionalBtnStyle();

    let textStyle;
    if(this.props.selected) {
      textStyle = {color: Colors.surfaceTextColor};
    } else {
      textStyle = {color: Colors.primaryTextColor}
    }
    return (
      <Button 
        {...this.props} 
        rounded
        bordered = {!this.props.selected}
        style = {[this.props.style, additionalStyle]}
      >
        <AppText 
          style = {[textStyle, {fontSize: 14}]}>
            {this.props.measurementType}
        </AppText>
      </Button>
      )
  }

  _addAdditionalBtnStyle() {
    let additionalStyle = {}
    let color = _.get(
      ColorsForMeasurementTypes, 
      this.props.measurementType, 
      DefaultColorForMeasurement
    );

    if (this.props.selected) {
      additionalStyle.backgroundColor = color;
    } else {
      additionalStyle.borderColor = color;
    }
    
    return additionalStyle;
  }
}
