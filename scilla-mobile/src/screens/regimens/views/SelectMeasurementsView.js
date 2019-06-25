// @flow
import React, { Component, Fragment } from "react";
import { 
  Regimen,
} from "../../../libs/scijs";
import type {
  MeasurementType
} from "../../../libs/scijs";
import { Platform, StyleSheet } from "react-native";
import { Row, Col, View, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Title, AppText, DotPageIndicator } from "../../../components";
import RegimenViewModel from "../../../viewModels/RegimenViewModel";
import _ from "lodash";

type Props = {
  regimen: Regimen,
  numStates: number,
  currentStateIndex: number
}

type MeasurementView = {
  type: MeasurementType, 
  selected: boolean, 
  required: boolean
}

class SelectMeasurementsView extends Component<Props, any> {

  onToggleMeasurement = (memView: MeasurementView) => {
    const { regimen } = this.props;
    
    if(memView.selected) {
      regimen.removeTrackedMeasurementType(memView.type);
    } else {
      regimen.addTrackedMeasurementType(memView.type);
    }

    this.forceUpdate();
  }

  render() {

    const { regimen } = this.props;

    const viewModel = new RegimenViewModel(regimen);
    
    // regimen.trackedMeasurementTypes

    return (
      <Fragment>
        <Title>Set side effects to monitor</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          dotColor='grey'
          activeDotColor='black'  
        />
        {this.renderMeasurements()}
      </Fragment>
    );
  }

  renderMeasurements() {
    const { regimen } = this.props;
    const viewModel = new RegimenViewModel(regimen);

    console.log(viewModel.measurements);

    return _.map<any, any>(viewModel.measurements, (m: MeasurementView) => {
      return (
        <Row>
          <Button 
            full 
            iconLeft 
            bordered 
            style={{width: '100%', marginTop: 10}}
            onPress={(e) => {this.onToggleMeasurement(m)}}
          >
              <Col size={1} style={{alignItems: 'flex-end'}}>
              {m.selected &&
              
                <Ionicons 
                  name={
                    Platform.OS === "ios"
                    ? "ios-checkmark"
                    : "md-checkmark"
                  }
                  size={30}
                />
              } 
              </Col>
              <Col size={4}>
                <AppText>
                  {m.type}
                </AppText>
              </Col>
          </Button>
        </Row>
      )
    })
  }
}

export default SelectMeasurementsView;