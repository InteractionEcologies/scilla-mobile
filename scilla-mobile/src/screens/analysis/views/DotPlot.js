// flow
import React from "react";
import { View } from "react-native";
import type {
  MeasurementType
} from "../../../libs/scijs";

import { 
  ColorsForMeasurementTypes, 
  DefaultColorForMeasurement 
} from "../constants";
import { 
  VictoryLabel,
  VictoryAxis,
  VictoryScatter,
  VictoryLine
} from "../../../libs/victory-native/lib"
import type {
  DailyEvalDataPoint,
} from "../../../models/analysis"
import _ from "lodash";
import { Svg } from "expo";
const { G } = Svg;

type Props = {
  width: number, 
  height: number,
  selectedMeasurementTypes: MeasurementType[],
  meanDataPoints: DailyEvalDataPoint[],
  dotDataPoints: DailyEvalDataPoint[],
  xDomain: number[],
  yDomain: number[],
  xTicks: number[]

}

const MIN_MEASUREMENT_SCORE = 0;
const MAX_MEASUREMENT_SCORE = 5;

export class DotPlot extends React.Component<Props, any> {
  render() {
    return (
      <View>
        <Svg 
          width = {this.props.width}
          height = {this.props.height}
        >
          <G transform={"translate(5,40)"}>
            <VictoryLabel 
            text={"Score"}
            dx={25}
            dy={25}
            />
            {this.renderXAxis()}
            {this.renderYAxis()}
            {this.renderGraph()}
          </G>
        </Svg>
      </View>
    )
  }

  renderXAxis() {
    let dosages = this.props.xTicks;
    return (
      <VictoryAxis
        tickValues={dosages}
        tickFormat = {(tick)=> `${tick}mg`}
        standalone={false}
        domain={this.props.xDomain}
      />
    )
  }

  renderYAxis() {
    return (
      <VictoryAxis
        dependentAxis
        standalone={false}
        tickFormat = { (tick)=> {
          if ( tick >= MIN_MEASUREMENT_SCORE && tick <= MAX_MEASUREMENT_SCORE) {
            return `${tick}`
          }}
        }
        domain={this.props.yDomain}
        style={{
          grid: {
              stroke: "#ccc",
              strokeWidth: 1
            }
        }}
      />
    )
  }

  renderGraph() {
    let chartLayers = [];
    if (this.props.selectedMeasurementTypes.length>0){
      let type = this.props.selectedMeasurementTypes[0]
      chartLayers.push(this._createALayerOfDots(type, this.props.dotDataPoints));
      chartLayers.push(this._createALayerOfMeanLine(type, this.props.meanDataPoints));

      // console.log('dot', this.props.dotDataPoints)
      // console.log('mean', this.props.meanDataPoints)
    }

    return (
      <G>{chartLayers}</G>
    )
  }

  _createALayerOfDots(type: MeasurementType, points: DailyEvalDataPoint[]) {
    if(!points) return;
    let color = _.get(ColorsForMeasurementTypes, type, DefaultColorForMeasurement);

    return (
      <VictoryScatter
        key = {`dotsplot-${type}`}
        style={{ data: { fill: color}, labels: { fill: color} }}
        domain={this._getXYDomains()}
        standalone={false}
        size={5}
        data={points}
        x={d=>d.x}
        y={d=>d.y}
      />
    )
  }

  _createALayerOfMeanLine(type: MeasurementType, points: DailyEvalDataPoint[]) {
    if(!points || points.length === 1) return;
    let color = _.get(ColorsForMeasurementTypes, type, DefaultColorForMeasurement);
    
    return (
      <VictoryLine
        key = {`line-${type}`}
        style={{
          data: {stroke: color, strokeWidth: 7, strokeOpacity: 0.4},
        }}
        domain={this._getXYDomains()}
        data={points}
        standalone={false}
        x={d=>d.dosage}
        y={d=>d.value}
        interpolation="monotoneX"
        animate={{ duration: 500 }}
      />
    )
  }

  _getXYDomains(){
    return {
      x: this.props.xDomain,
      y: this.props.yDomain
    }
  }

}