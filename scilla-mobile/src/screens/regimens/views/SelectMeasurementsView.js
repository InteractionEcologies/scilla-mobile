// @flow
import React, { Component } from "react";
import { 
  IRegimen,
} from "../../../libs/scijs";
import type {
  MeasurementType
} from "../../../libs/scijs";
import { Platform } from "react-native";
import { View, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Title, AppText, DotPageIndicator } from "../../../components";
import RegimenViewModel from "../../../viewModels/RegimenViewModel";
import _ from "lodash";

type Props = {
  regimen: IRegimen,
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

    return (
      <View>
        <Title>Select side effects to monitor</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
        />
        {this.renderMeasurements()}
      </View>
    );
  }

  renderMeasurements() {
    const { regimen } = this.props;
    const viewModel = new RegimenViewModel(regimen);

    console.log(viewModel.measurements);
    let index = 0;
    return _.map<any, any>(viewModel.measurements, (m: MeasurementView) => {
      index += 1;
      return (
        <View key={index} style={{width: '100%'}}>
          <Button 
            full 
            iconLeft 
            bordered={ m.selected ? false: true}
            style={{width: '100%', marginTop: 10}}
            onPress={(e) => {this.onToggleMeasurement(m)}}
          >
              <View style={{alignItems: 'center', flex: 2}}>
              {m.selected &&
                <Ionicons 
                  name={
                    Platform.OS === "ios"
                    ? "ios-checkmark"
                    : "md-checkmark"
                  }
                  size={20}
                />
              } 
              </View>
              <View style={{flex: 4}}>
                <AppText>
                  {m.type}
                </AppText>
              </View>
          </Button>
        </View>
      )
    })
  }
}

export default SelectMeasurementsView;