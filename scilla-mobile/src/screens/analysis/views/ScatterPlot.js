// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import type {
  MeasurementType
} from "../../../libs/intecojs";
import { MeasurementTypes, DateFormatISO8601 } from "../../../libs/intecojs"; 
import { 
  DailyEvalDataFrame
} from "../../../models/analysis";
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
  Point2D, 
  DailyEvalDataPoint
} from "../../../models/analysis"
import _ from "lodash";
import { Svg } from "expo";
const { G } = Svg;

type Props = {
  width: number, 
  height: number,
  selectedMeasurementTypes: MeasurementType[],
  dataPoints: DailyEvalDataPoint[],
  xDomain: number[],
  yDomain: number[],
  xTicks: number[]

}

const X_AXIS_PADDING = 2;
const Y_AXIS_PADDING = 0.5;
const MIN_MEASUREMENT_SCORE = 0;
const MAX_MEASUREMENT_SCORE = 5;

export class ScatterPlot extends React.Component<Props, any> {
  render() {
    return (
      <View>
        <Svg 
          width = {this.props.width}
          height = {this.props.height}
        >
          <VictoryLabel 
            text={"Avg \n Score"}
          />
          <G transform={"translate(5,40)"}>
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
    // let chartLayers = [];
    // this.props.selectedMeasurementTypes.forEach((type: MeasurementType, i: number) => {
    //   chartLayers.push(this._createALayerOfMeanPointsByType(type, meanData));
    //   chartLayers.push(this._createALayerOfMeanLineByType(type, meanData));
    // })
    // return (
    //   <G>{chartLayers}</G>
    // )
  }

  _createALayerOfMeanPointsByType(type: MeasurementType, points: DailyEvalDataPoint[]) {
    // For each measurement type, create a list of points for mean at each
    // dosage level, 
    // if(points.length === 0) return;
    // let dosages = this.props.xTicks;
    // let color = _.get(ColorsForMeasurementTypes, type, DefaultColorForMeasurement);

    // // Ploting the mean for each phase
    // return (
    //   <VictoryScatter
    //     key = {`scatterplot-${type}`}
    //     style={{ data: { fill: color}, labels: { fill: color} }}
    //     domain={this._getXYDomains()}
    //     standalone={false}
    //     size={9}
    //     data={points}
    //   />
    // )
  }

  _createALayerOfMeanLineByType(type: MeasurementType, points: Point2D[]) {
    // if(points.length === 0) return;
    // let color = _.get(ColorsForMeasurementTypes, type, DefaultColorForMeasurement);
    // let dosages = this.props.dataframe.getDosages();
    
    // return (
    //   <VictoryLine
    //     key = {`line-${type}`}
    //     style={{
    //       data: {stroke: color},
    //     }}
    //     data={points}
    //     domain={this._getXYDomains()}
    //     standalone={false}
    //   />
    // )
  }

}