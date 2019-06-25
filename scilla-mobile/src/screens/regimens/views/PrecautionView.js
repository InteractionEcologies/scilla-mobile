// @flow
import React, { Component, Fragment } from "react"; 
import { Title, AppText, DotPageIndicator } from "../../../components";
import { Grid, Row, Col } from "native-base";

type Props = {
  numStates: number, 
  currentStateIndex: number
}

class PrecautionView extends Component<Props, any> {

  render() {
    return (
      <Fragment>
        <Title>Precautions</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          dotColor='grey'
          activeDotColor='black'  
        />
        <Grid>
          <Row>
            <AppText>• Do not stop your medication abruptly.</AppText> 
          </Row>
          <Row>
            <AppText>• Contact your doctor if you have any questions.</AppText> 
          </Row>
        </Grid>
      </Fragment>
    );
  }
}

export default PrecautionView;