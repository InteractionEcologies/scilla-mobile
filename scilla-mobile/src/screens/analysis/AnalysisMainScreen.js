// @flow
import React from "react";
import { StyleSheet, ScrollView  } from 'react-native';
import { Content, View, Button, Card, CardItem} from "native-base";
import { AppText, Title } from "../../components";
import moment from "moment";
import AppState from "../../app/AppState";
import { MeasurementTypes, DateFormatISO8601 } from "../../libs/intecojs"; 
import type {
  MeasurementObject,
  MeasurementType,
  MeasurementValue,
  DailyEvaluationObject
} from "../../libs/intecojs"
import { Regimen } from "../../models/regimen";
import _ from "lodash";
import { BaclofenUtils } from "../../models/regimen/utils";
import { NotExistError } from "../../libs/intecojs";
import { 
  VictoryChart, 
  VictoryAxis, 
  VictoryScatter, 
  VictoryLine, 
  VictoryLabel, 
  VictoryVoronoiContainer, 
  VictoryTooltip, 
  VictoryGroup 
} from "../../libs/victory-native/lib";

import { 
  ColorsForMeasurementTypes, 
  DefaultColorForMeasurement 
} from "./constants";
import { MeasurementSelectionBtn } from "./views/MeasurementSelectionBtn";
import { Svg } from "expo";
const { Circle, Rect, G } = Svg; 

const appState = new AppState();

type State = {
  trackedMeasurementTypes: MeasurementType[],
  selectedMeasurementTypes: string[],
  measurementReportSummariesByPhases: MeasurementReportSummary[],
  dosageByPhases: number[], // a list of dosages for each phase. (TODO: Why not store this in the summary?)
}

// Stores the score map for each measurement type for a period of time. 
type MeasurementReportSummary = {
  [key: MeasurementType]: ScoreMap
} 

// Number of reports for each score per measurement. 
type ScoreMap = {
  "0": number,
  "1": number,
  "2": number,
  "3": number,
  "4": number,
  "5": number
} 

export default class AnalysisMainScreen extends React.Component<any, State> {
  static navigationOptions: any = {
    title: "Analysis"
  }

  state = {
    trackedMeasurementTypes: [],
    selectedMeasurementTypes: [],
    measurementReportSummariesByPhases: [], 
    dosageByPhases: []
  }

  componentDidMount() {
    this.initializeState()
  }

  async initializeState() {
    try { 
      let regimen = await appState.getLatestRegimen();
      this._initMeasurementReportSummariesByPhases(regimen);
      this._initDosageByPhases(regimen);

      this.setState({
        trackedMeasurementTypes: regimen.getTrackedMeasurementTypes(),
        selectedMeasurementTypes: [regimen.getTrackedMeasurementTypes()[0]]
      })
      
    } catch(e) {
      console.log(e)
    }
  }

  _initMeasurementReportSummariesByPhases(regimen: Regimen) {
    let measurementReportSummariesByPhases = [];

    regimen.getRegimenPhases().forEach((regimenPhase)=>{
      let summary = this._createMeasurementReportSummaryForPeriod(
        regimenPhase.startDate, 
        regimenPhase.endDate
      )
      measurementReportSummariesByPhases.push(summary);
    })  

    this.setState({
      measurementReportSummariesByPhases: measurementReportSummariesByPhases
    })
  }

  _initDosageByPhases(regimen: Regimen) {
    let dosageByPhases = []
    regimen.getRegimenPhases().forEach((regimenPhase)=>{
      let dosageInThisPhase = this._getDosageByDate(regimenPhase.startDate);
      dosageByPhases.push(dosageInThisPhase);
    }) 

    this.setState({dosageByPhases: dosageByPhases})
  }

  async _createMeasurementReportSummaryForPeriod(
    startDate: string, 
    endDate: string
  ): MeasurementReportSummary {
    try {
      let dailyEvalReportsByDateRange = await appState.getDailyEvalsByDateRange(startDate, endDate);
      return this._countScores(dailyEvalReportsByDateRange);
    } catch(e) {
      console.log(e);
    }
  }

  _countScores = (dailyEvalReports: DailyEvaluationObject[]): MeasurementReportSummary => {
    let measurementReportSummary: MeasurementReportSummary = {};

    for (let measurementType of this.state.trackedMeasurementTypes) {
      measurementReportSummary[measurementType] = this._initScoreMap();
      
      dailyEvalReports.forEach(report => {
        if(_.includes(report.measurementsByType, measurementType)) {
          let value: string = report.measurementsByType[measurementType].toString();
          measurementReportSummary[measurementType][value] += 1;
        }
      })
    }
    return measurementReportSummary
  }

  _initScoreMap(): ScoreMap {
    return {
      "0" : 0,
      "1" : 0,
      "2" : 0,
      "3" : 0,
      "4" : 0,
      "5" : 0
    }
  }

  _getDosageByDate(date: string){
    try {
        return BaclofenUtils.getDosageByDate(date);
    } catch (e) {
        if (e.name = NotExistError.name) {
          console.log(e.name)
        }
        return -1; // error;
    }
  }

  renderChart =() =>{

    if (this.state.selectedMeasurementTypes.length > 1) {
      let chart = []
      this.state.selectedMeasurementTypes.forEach((type,i)=>{
        let meanData = []
        let color = ColorsForMeasurementTypes[type]
        this.state.measurementReportSummariesByPhases.forEach((numOfReportsByScore,i)=>{
          let dosage = this.state.dosageByPhases[i] 
          meanData.push({
            'x': dosage,
            'y': this._getMeanScore(numOfReportsByScore[type])
          })        
        })
        chart.push(            
          <VictoryScatter
            key = {`scatter${i}`}
            style={{ data: { fill: color}, labels: { fill: color} }}
            domain={{x:[this.state.dosageByPhases[0]-2
                        ,this.state.dosageByPhases[this.state.dosageByPhases.length-1]+2],
                    y:[-0.5,5.5]}}
            standalone={false}
            size={9}
            data={meanData}
            labels={(d) => `y: ${d.y}`}
            labelComponent={
                <VictoryTooltip
                  style={{ fontSize: 10 }}
                  renderInPortal={false}
                />
            }
          />
          )
        chart.push(
          <VictoryLine
            key = {`line${i}`}
            style={{
              data: { stroke: color},
            }}
            data={meanData}
            domain={{x:[this.state.dosageByPhases[0]-2
                        ,this.state.dosageByPhases[this.state.dosageByPhases.length-1]+2],
                      y:[-0.5,5.5]}}
            standalone={false}
            //name="linePoints"
          />
        )
      })
      return (
        <G> 
          {chart}
        </G>
      ) 
    } else if (this.state.selectedMeasurementTypes.length === 1){
      let meanData = []
      let data = []
      let selectedMeasurementTypes = this.state.selectedMeasurementTypes[0]
      let color = ColorsForMeasurementTypes[selectedMeasurementTypes]
      this.state.measurementReportSummariesByPhases.forEach((numOfReportsByScore,i) => {

          let dosage = this.state.dosageByPhases[i] 
          meanData.push({
            'x': dosage,
            'y': this._getMeanScore(numOfReportsByScore[selectedMeasurementTypes])
          }) 
          
          _.keys(numOfReportsByScore[selectedMeasurementTypes]).forEach((score) => {
            let count = numOfReportsByScore[selectedMeasurementTypes][score]
            if(count === 1){
              data.push({
                'x': dosage,
                'y': parseInt(score, 10)
              })
            } else if(count > 1){            
              data= [...data, ...this._getDisplacedDataPosition(dosage, parseInt(score, 10), count)]
            }
          })
      })
      return(
            <G>
              <VictoryScatter
                style={{ data: { fill: color} }}
                domain={{x:[this.state.dosageByPhases[0]-2
                            ,this.state.dosageByPhases[this.state.dosageByPhases.length-1]+2],
                          y:[-0.5,5.5]}}
                standalone={false}
                size={5}
                data={data}
              />
              <VictoryLine
                style={{
                  data: { stroke: color ,  strokeWidth: 6.5, strokeOpacity: 0.5},
                }}
                data={meanData}
                domain={{x:[this.state.dosageByPhases[0]-2
                            ,this.state.dosageByPhases[this.state.dosageByPhases.length-1]+2],
                          y:[-0.5,5.5]}}
                standalone={false}
                interpolation="monotoneX"
                animate={{
                  duration: 500,
                }}
              />
            </G>
      );
    }  
  }

  _getMeanScore = (numOfReportsByScore:any) => {
    let weightedSum = 0
    let totalCounts = 0 
    _.keys(numOfReportsByScore).forEach((score)=>{
      weightedSum += parseInt(score)*numOfReportsByScore[score]
      totalCounts += numOfReportsByScore[score]
    }) 
    return totalCounts===0? 0: weightedSum / totalCounts
  }

  _getDisplacedDataPosition = (x: number, y: number, count: number) => {
    let data=[]
    let numberOfColumns = 2 
    let numberOfRows = Math.ceil(count / numberOfColumns)
    let step = 0.2
    let stepx = step*5
    let baselineY = y - ((numberOfRows-1)/2)*step
    let baselineX = x - (numberOfColumns/2)*stepx/2

    for(let i=0 ; i<count ; i++){
      let nthColumn = (i) % numberOfColumns
      let displacedX = baselineX + nthColumn*stepx
      if(count%2 !==0 && i===count-1){
        displacedX = x
      }
      
      let nthRow = Math.floor(i / numberOfColumns) 
      let displacedY = baselineY + nthRow*step 

      data.push({
        'x': +displacedX.toFixed(2),
        'y': +displacedY.toFixed(2)
      })
    }
    return data
  }

  render() {
    return (
      <ScrollView>
      <Content contentContainerStyle={styles.mainView}>
        <Title>Symptom and side effects under different dosages</Title> 
        <View style={styles.btnView}>
          {this.renderSelectionButtons()}
        </View>
        <View>
          <Svg width="400" height="360" >
            <VictoryLabel x={25} y={65} 
              text={"Ave \nScore"}
            />
            {/* <VictoryChart
                containerComponent={
                  <VictoryVoronoiContainer/>
                }
                groupComponents = {
                  <g transform="translate(5, 40)" />
              }
            > */}
              <G transform={"translate(5, 40)"}>
                <VictoryAxis
                    tickValues={this.state.dosageByPhases}
                    tickFormat = {(tick)=> `${tick}mg`}
                    standalone={false}
                    domain={[this.state.dosageByPhases[0]-2, 
                              this.state.dosageByPhases[this.state.dosageByPhases.length-1]+2]}
                  />
                  <VictoryAxis
                    dependentAxis
                    standalone={false}
                    tickFormat = {(tick)=> {if(tick>=0 && tick<=5){return `${tick}`}}}
                    domain={[-0.5, 5.5]}
                    style={{
                      grid: {
                          stroke: "#ccc",
                          strokeWidth: 1
                        }
                    }}
                  />
                {this.renderChart()}
              </G>
            {/* </VictoryChart> */}
          </Svg>
        </View>
      </Content>
      </ScrollView>
    )
  }

  renderSelectionButtons = (): any => {
    return this.state.trackedMeasurementTypes.map( (type: string, i: number): any => {
      let selected: boolean = this.state.selectedMeasurementTypes.includes(type)
      return (
        <MeasurementSelectionBtn
          key = {i}
          measurementType = {type}
          selected = {selected}
          style = {styles.btn}
          onPress = {() => this._onBtnPress(type)}
        />
      );
    })
  }

  _onBtnPress = (pressedType:string) => {
      if(this.state.selectedMeasurementTypes.includes(pressedType)){
        let selectedMeasurementTypes = this.state.selectedMeasurementTypes.filter(type=>type!==pressedType)
        this.setState({
          selectedMeasurementTypes
        })
      } else {
        this.setState({
          selectedMeasurementTypes: [...this.state.selectedMeasurementTypes, pressedType]
        })
      }
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  btnView:{
    height: 50,
    width: 340,
    flexDirection: "row",
    flexWrap: 'wrap',
    marginTop: 30,
    marginBottom: 50,
    marginLeft: 10
  },
  btn: {
    height: 50,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: null,
    borderColor: null
  }
})
