// @flow
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "native-base";
import { AppText } from "../../../components";
import Colors from "../../../constants/Colors";
import type {
  MeasurementType
} from "../../../libs/intecojs";
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
    let btnStyle = this._getAdditionalBtnStyle();
    return (
      <Button 
        {...this.props} 
        rounded
        bordered = {!this.props.selected}
        style={[this.props.style, btnStyle]}
      >
        <AppText 
          style = {this.props.selected ? null : Colors.primaryTextColor}>
            {this.props.measurementType}
          </AppText>
      </Button>
      )
  }

  _getAdditionalBtnStyle() {
    let btnStyle = this.props.styles.btn;
    let color = _.get(
      ColorsForMeasurementTypes, 
      this.props.measurementType, 
      DefaultColorForMeasurement
    );

    if (this.props.selected) {
      btnStyle.backgroundColor = color;
    } else {
      btnStyle.borderColor = color;
    }
    
    return btnStyle;
  }
}
