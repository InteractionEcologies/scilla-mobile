// @flow
import type {
  DailyEvaluationObject
} from "../../libs/intecojs"
import type {
  DailyEvalDataPoint
} from "./index"
import { IRegimenPhase} from "../../libs/intecojs/models/regimen"
import { MeasurementTypes } from "../../libs/intecojs";
import { BaclofenUtils } from "../../libs/intecojs/models/regimen";
import {PlottableMeasurementTypes} from "../../screens/analysis/constants"
import _ from "lodash";

// export const PlottableMeasurementTypes = [
//   MeasurementTypes.sleepQuality,
//   MeasurementTypes.spasticitySeverity, 
//   MeasurementTypes.tiredness, 
//   MeasurementTypes.mood,
//   MeasurementTypes.baclofenAmount
// ]
  
const Scope = "AnalysisUtils"

export class AnalysisUtils {
  static convertDailyEvalObjToDataPoints(
    obj: DailyEvaluationObject,
    dosage: number,
  ): DailyEvalDataPoint[] {

    let points: DailyEvalDataPoint[] = [];

    for(let type of PlottableMeasurementTypes) {
      if(_.has(obj.measurementsByType, type)) {
        let point = {
          type: type,
          date: obj.date,
          createdAtTimestamp: obj.createdAtTimestamp,
          
          dosage: dosage,
          value: obj.measurementsByType[type]
        }
        points.push(point);
      }

    }
    return points;
  }

  static convertDailyEvalObjsToDataPoints(
    objs: DailyEvaluationObject[], 
    dosage: number
  ): DailyEvalDataPoint[] {
    let allPoints: DailyEvalDataPoint[] = [];
    
    for(let obj of objs) {
      let points = AnalysisUtils.convertDailyEvalObjToDataPoints(
        obj,
        dosage
      );
      allPoints = allPoints.concat(points);
    }
    return allPoints;
  }
}