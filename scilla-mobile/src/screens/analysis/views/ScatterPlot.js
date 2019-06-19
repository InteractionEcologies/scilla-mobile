// @flow
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
  VictoryLine,
  VictoryTooltip,
} from "../../../libs/victory-native/lib"
import type {
  DailyEvalDataPoint
} from "../../../models/analysis"
import _ from "lodash";
import { Svg } from "expo";
const { G } = Svg;

type Props = {
  width: number, 
  height: number,
  selectedMeasurementTypes: MeasurementType[],
  meanDataPoints: DailyEvalDataPoint[],
  xDomain: number[],
  yDomain: number[],
  xTicks: number[]

}

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
          <G transform={"translate(5,40)"}>
            <VictoryLabel 
              text={"Avg Score"}
              dx={20}
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
    if(this.props.meanDataPoints.length>1){
      let groupedMeanDataPoints = _.groupBy(this.props.meanDataPoints, 'type')
      console.log(groupedMeanDataPoints)
      this.props.selectedMeasurementTypes.forEach((type: MeasurementType, i: number) => {
        chartLayers.push(this._createALayerOfMeanPointsByType(type, groupedMeanDataPoints[type]));
        chartLayers.push(this._createALayerOfMeanLineByType(type, groupedMeanDataPoints[type]));
      })
    }
    return (
       <G>{chartLayers}</G>
    )
  }

  _createALayerOfMeanPointsByType(type: MeasurementType, points: DailyEvalDataPoint[]) {
    // For each measurement type, create a list of points for mean at each
    // dosage level, 
    if(!points) return;
    //let dosages = this.props.xTicks;
    let color = _.get(ColorsForMeasurementTypes, type, DefaultColorForMeasurement);

    // Ploting the mean for each phase
    return (
      <VictoryScatter
        key = {`scatterplot-${type}`}
        style={{ data: { fill: color}, labels: { fill: color} }}
        domain={this._getXYDomains()}
        standalone={false}
        size={9}
        data={points}
        x={d=>d.dosage}
        y={d=>d.value}
        labelComponent={
          <VictoryTooltip
            style={{ fontSize: 10 }}
            renderInPortal={false}
          />
        }
      />
    )
  }

  _createALayerOfMeanLineByType(type: MeasurementType, points: DailyEvalDataPoint[]) {
    if(!points || points.length <= 1) return;
    let color = _.get(ColorsForMeasurementTypes, type, DefaultColorForMeasurement);
    //let dosages = this.props.dataframe.getDosages();
    
    return (
      <VictoryLine
        key = {`line-${type}`}
        style={{
          data: {stroke: color},
        }}
        domain={this._getXYDomains()}
        standalone={false}
        data={points}
        x={d=>d.dosage}
        y={d=>d.value}
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