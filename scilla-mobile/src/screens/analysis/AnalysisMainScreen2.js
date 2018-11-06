// // @flow
// import React from "react";
// import { StyleSheet, ScrollView  } from 'react-native';
// import { Content, View, Button, Card, CardItem} from "native-base";
// import { AppText, Title } from "../../components";
// import moment from "moment";
// import AppState from "../../app/AppState";
// import { MeasurementTypes, DateFormatISO8601 } from "../../libs/intecojs"; 
// import type {
//   MeasurementObject,
//   MeasurementType,
//   MeasurementValue,
//   DailyEvaluationObject
// } from "../../libs/intecojs"
// import { Regimen } from "../../models/regimen";
// import _ from "lodash";
// import { BaclofenUtils } from "../../models/regimen/utils";
// import { AnalysisUtils } from "../../models/analysis/utils";
// import { NotExistError } from "../../libs/intecojs";
// import { 
//   VictoryChart, 
//   VictoryAxis, 
//   VictoryScatter, 
//   VictoryLine, 
//   VictoryLabel, 
//   VictoryVoronoiContainer, 
//   VictoryTooltip, 
//   VictoryGroup 
// } from "../../libs/victory-native/lib";
// import { DailyEvalDataFrame } from "../../models/analysis/";
// import { IRegimenPhase } from "../../models/regimen";
// import { 
//   ColorsForMeasurementTypes, 
//   DefaultColorForMeasurement 
// } from "./constants";
// import { MeasurementSelectionBtn } from "./views/MeasurementSelectionBtn";
// import { Svg } from "expo";
// import { ScatterPlot } from "./views/ScatterPlot";
// const { Circle, Rect, G } = Svg; 

// const appState = new AppState();

// type State = {
//   trackedMeasurementTypes: MeasurementType[],
//   selectedMeasurementTypes: string[],
//   dailyEvalDataFrame: DailyEvalDataFrame
// }

// export default class AnalysisMainScreen extends React.Component<any, State> {
//   static navigationOptions: any = {
//     title: "Analysis"
//   }

//   state = {
//     trackedMeasurementTypes: [],
//     selectedMeasurementTypes: [],
//     dailyEvalDataFrame: new DailyEvalDataFrame()
//   }

//   dailyEvalDataFrame = new DailyEvalDataFrame()

//   componentDidMount() {
//     this.initializeState()
//   }

//   async initializeState() {
//     try { 
//       let regimen = await appState.getLatestRegimen();
//       this._initDailyEvalDataFrame(regimen);

//       this.setState({
//         trackedMeasurementTypes: regimen.getTrackedMeasurementTypes(),
//         selectedMeasurementTypes: [regimen.getTrackedMeasurementTypes()[0]]
//       })
      
//     } catch(e) {
//       console.log(e)
//     }
//   }

//   async _initDailyEvalDataFrame(regimen: Regimen) {
//     let measurementReportSummariesByPhases = [];

//     regimen.getRegimenPhases().forEach( async (regimenPhase: IRegimenPhase) => {
//       let dailyEvalsByDateRange = await this._getDailyEvalsFromRegimenPhase(regimenPhase)
//       console.log('Daily Evals for Regimen Phase', regimenPhase.startDate, dailyEvalsByDateRange);

//       let points = AnalysisUtils.convertDailyEvalObjsToDataPoints(
//         dailyEvalsByDateRange,
//         regimenPhase
//       );
//       console.log("Converted points", points);
//       this.dailyEvalDataFrame.addDataPoints(points);
//     })  

//     this.setState({
//       dailyEvalDataFrame: this.dailyEvalDataFrame
//     })
//   }

//   async _getDailyEvalsFromRegimenPhase(regimenPhase: IRegimenPhase): Promise<DailyEvaluationObject[]> {
//     try {
//       let dailyEvalsByDateRange = await appState.getDailyEvalsByDateRange(
//         regimenPhase.startDate,
//         regimenPhase.endDate
//       );
//       console.log("Get Daily Evals from Database", dailyEvalsByDateRange);
//       return dailyEvalsByDateRange
//     } catch (e) {
//       console.log(e);
//     }
//     return Promise.resolve([])
//   }

//   // async _createMeasurementReportSummaryForPeriod(
//   //   startDate: string, 
//   //   endDate: string
//   // ): MeasurementReportSummary {
//   //   try {
//   //     let dailyEvalReportsByDateRange = await appState.getDailyEvalsByDateRange(startDate, endDate);
//   //     return this._countScores(dailyEvalReportsByDateRange);
//   //   } catch(e) {
//   //     console.log(e);
//   //   }
//   // }

//   // _countScores = (dailyEvalReports: DailyEvaluationObject[]): MeasurementReportSummary => {
//   //   let measurementReportSummary: MeasurementReportSummary = {};

//   //   for (let measurementType of this.state.trackedMeasurementTypes) {
//   //     measurementReportSummary[measurementType] = this._initScoreMap();
      
//   //     dailyEvalReports.forEach(report => {
//   //       if(_.includes(report.measurementsByType, measurementType)) {
//   //         let value: string = report.measurementsByType[measurementType].toString();
//   //         measurementReportSummary[measurementType][value] += 1;
//   //       }
//   //     })
//   //   }
//   //   return measurementReportSummary
//   // }

//   // _initScoreMap(): ScoreMap {
//   //   return {
//   //     "0" : 0,
//   //     "1" : 0,
//   //     "2" : 0,
//   //     "3" : 0,
//   //     "4" : 0,
//   //     "5" : 0
//   //   }
//   // }

//   // _getDosageByDate(date: string){
//   //   try {
//   //       return BaclofenUtils.getDosageByDate(date);
//   //   } catch (e) {
//   //       if (e.name = NotExistError.name) {
//   //         console.log(e.name)
//   //       }
//   //       return -1; // error;
//   //   }
//   // }

//   render() {
//     return (
//       <ScrollView>
//         <Content contentContainerStyle={styles.mainView}>
//           <Title>Symptom and side effects under different dosages</Title> 
//           {this.renderSelectionButtons()}
//           {this.renderChart()}
//         </Content>
//       </ScrollView>
//     )
//   }

//   renderSelectionButtons = (): any => {
//     let buttons = this.state.trackedMeasurementTypes.map( (type: string, i: number): any => {
//       let selected: boolean = this.state.selectedMeasurementTypes.includes(type)
//       return (
//         <MeasurementSelectionBtn
//           key = {i}
//           measurementType = {type}
//           selected = {selected}
//           style = {styles.btn}
//           onPress = {() => this._onBtnPress(type)}
//         />
//       );
//     })
//     return (
//       <View style={styles.btnView}>
//         {buttons}
//       </View>
//     )
//   }

//   _onBtnPress = (pressedType:string) => {
//       if(this.state.selectedMeasurementTypes.includes(pressedType)){
//         let selectedMeasurementTypes = this.state.selectedMeasurementTypes.filter(type=>type!==pressedType)
//         this.setState({
//           selectedMeasurementTypes
//         })
//       } else {
//         this.setState({
//           selectedMeasurementTypes: [...this.state.selectedMeasurementTypes, pressedType]
//         })
//       }
//   }

//   renderChart = () => {
//     if(this.state.selectedMeasurementTypes.length > 1) {
//       return <ScatterPlot 
//         width={400}
//         height={360}
//         selectedMeasurementTypes={this.state.selectedMeasurementTypes}
//         dataframe={this.state.dailyEvalDataFrame}
//       />      
//     } else {

//     }
//   }
// }

// const styles = StyleSheet.create({
//   mainView: {
//     flex: 1, 
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white'
//   },
//   btnView:{
//     height: 50,
//     width: 340,
//     flexDirection: "row",
//     flexWrap: 'wrap',
//     marginTop: 30,
//     marginBottom: 50,
//     marginLeft: 10
//   },
//   btn: {
//     height: 50,
//     marginRight: 6,
//     marginBottom: 6,
//     backgroundColor: null,
//     borderColor: null
//   }
// })
