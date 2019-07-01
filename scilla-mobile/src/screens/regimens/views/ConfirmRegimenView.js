// @flow
import React, { Component } from "react";

import type { IRegimen } from "../../../libs/scijs";

import {
  AppText,
  Title,
  DotPageIndicator
} from "../../../components"
import { Grid, Row, Col, View, Button } from "native-base";
import { StyleSheet } from "react-native";
import styles from "../RegimenStyles";
import Colors from "../../../constants/Colors";
import _ from "lodash";

type Props = {
  // All of the views inside my react-automata will be rendered 
  // at the beginning while there is no regimen. Thus, all the views
  // should handle situation when there is no regimen. 
  regimen: IRegimen,
  onConfirmed: () => Promise<void>,
  numStates: number, 
  currentStateIndex: number
}

const customStyles = StyleSheet.create({
  view: {
    width: '100%',
    // backgroundColor: Colors.accentColor
  },
  labelText: {
    textAlign: 'right',
    paddingRight: 10,
  },
  button: {
    marginTop: 10
  }
});

class ConfirmRegimenView extends Component<Props, any> {
  
  confirm = () => {
    this.props.onConfirmed();
  }

  _renderRegimenInfo = () => {
    let { regimen } = this.props;
    const param = regimen.regimenParam;

    return (
      <View>
        <Title>Your Regimen</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          dotColor='grey'
          activeDotColor='black'  
        />
        <Grid>
          <Row>
            <Col><AppText style={customStyles.labelText}>Medicine</AppText></Col>
            <Col><AppText>Baclofen</AppText></Col>
          </Row>
          <Row>
            <Col><AppText style={customStyles.labelText}>Start dosage</AppText></Col>
            <Col><AppText>{param.startDosageMg} mg</AppText></Col>
          </Row>
          <Row>
            <Col><AppText style={customStyles.labelText}>Increment</AppText></Col>
            <Col><AppText>{param.incrementMg} mg</AppText></Col>
          </Row>
          <Row>
            <Col><AppText style={customStyles.labelText}>Phase Length</AppText></Col>
            <Col><AppText>{param.phaseLengthDays} days</AppText></Col>
          </Row>
          <Row>
            <Col><AppText style={customStyles.labelText}>Max dosage</AppText></Col>
            <Col><AppText>{param.maxDosageMg} mg</AppText></Col>
          </Row>
        </Grid>
        <Button
          style={customStyles.button}
          full
          onPress={this.confirm}>
          <AppText>Confirm</AppText>
        </Button>
      </View>
    )
  }


  render() {

    return (
      <View style={customStyles.view}>
        {this._renderRegimenInfo()}
      </View>
    )
  }
}

export default ConfirmRegimenView;