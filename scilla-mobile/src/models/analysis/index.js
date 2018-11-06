// @flow
import type { 
  MeasurementType, 
  DateTypeISO8601,
  MeasurementValue
} from "../../libs/intecojs"; 
import _ from "lodash";

export type MeasurementReportSummary = {
  [key: MeasurementType]: ScoreMap
}

// Number of reports for each score per measurement. 
export type ScoreMap = {
  [score: string]: number,
  mean?: number
} 

export type Point2D = {
  x: number, 
  y: number
}

export type DailyEvalDataPoint = {
  x?: number, 
  y?: number,
  type: MeasurementType, 
  date: DateTypeISO8601,
  createdAtTimestamp: number,
  // phase: number,

  dosage: number, 
  value: MeasurementValue
}

// Summary of each phase's measurement reports
export class DailyEvalDataFrame {
  points: DailyEvalDataPoint[] = []

  // Cache the result
  // A list of dosages for this set of daily evaluation points
  dosages: number[] 
  
  // Cache the frequency of scores for each measurement as well
  // as other statistics such as mean. 
  summary: {
    [key: MeasurementType]: {
      [dosage: number]: ScoreMap
    }
  }

  addDataPoint(point: DailyEvalDataPoint) {
    this.points.push(point);
  }

  addDataPoints(points: DailyEvalDataPoint[]) {
    this.points.concat(points);
  }

  getDosages(): number[] {
    if(this.dosages) {
      return this.dosages
    } else {
      this.dosages = _.sortBy(_.uniqBy(_.map(this.points, 'dosage')))
      return this.dosages
    }
  }

  summarize() {
    let summary = {};
    let groupByType = _.groupBy(this.points, 'type');
    
    _.forEach(groupByType, (objs, type) => {
      summary[type] = {}
      let groupByDosage = _.groupBy(objs, 'dosage');
      
      _.forEach(groupByDosage, (objs, dosage) => {
        // Get frequency map
        let scoreMap: ScoreMap = _.countBy(objs, 'value');
        scoreMap['mean'] = _.meanBy(objs, 'value');

        summary[type][dosage] = scoreMap; 

      })
    })
    
    this.summary = summary;
  }

  // getMeanDataPointsForPhases(type: MeasurementType): Point2D[] {
  //   if(this.summary === null) { this.summarize() };
  //   if(!_.has(this.summary, type)) {
  //     return [];
  //   }

  //   let points: Point2D[] = [];
  //   _.forEach(this.summary[type], (obj, dosage) => {
  //     points.push( {
  //       x: dosage, 
  //       y: obj.mean
  //     })
  //   })

  //   return points;
  // }

  getMeanDataPointsByTypeAndPhase(types: MeasurementType[]): DailyEvalDataPoint[] {
    return [];
  }
  
}