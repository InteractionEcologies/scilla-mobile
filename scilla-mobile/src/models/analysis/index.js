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
  date?: DateTypeISO8601,
  createdAtTimestamp?: number,
  // phase: number,

  dosage: number, 
  value: MeasurementValue
}


export type MeanDataSummary = {
  [key: MeasurementType]: Point2D[]
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
    this.points = this.points.concat(points);
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

  getMeanDataPointsForPhases(type: MeasurementType): Point2D[] {
    if(this.summary == null) { this.summarize() };
    if(!_.has(this.summary, type)) {
      return [];
    }

    let points: Point2D[] = [];
    _.forEach(this.summary[type], (obj, dosage) => {
      points.push( {
        x: dosage, 
        y: obj.mean
      })
    })

    return points;
  }

  getMeanDataPointsByTypes(types: MeasurementType[]): DailyEvalDataPoint[] {
    if(this.summary == null) { 
      this.summarize(); 
    };

    let points: DailyEvalDataPoint[] = [];
    _.forEach(this.summary, (scoreMapByDosage, type) => {
      if(_.includes(types, type)) {
        _.forEach(scoreMapByDosage, (scoreMap, dosage) => {
          if(scoreMap.mean || scoreMap.mean === 0 ) {
            let point = {
              type: type,
              dosage: parseInt(dosage, 10),
              value: scoreMap.mean
            }
            points.push(point);
          }          
        })
      };
    })

    return points;
  }

  getDisplacedDataPointsByType(type: MeasurementType): DailyEvalDataPoint[] {
    if(this.summary == null) { this.summarize() };
    let points: DailyEvalDataPoint[] = [];

    _.forEach(this.summary[type], (scoreMap, dosage) => {
      _.forEach(scoreMap, (count, score) =>{
        if(score !== "mean"){
          if(count !== 1 ){
            points = points.concat(this._calculateDisplacedDataPoints(parseInt(dosage), parseInt(score), count, type))
          } else {
            let point = {
              x: parseInt(dosage, 10),
              y: parseInt(score),
              type: type,
              dosage: parseInt(dosage, 10),
              value: score
            }
            points.push(point);
          }
        }
      })
    })
    return points;
  }


  _calculateDisplacedDataPoints(dosage:number, score:number, count: number, type: MeasurementType): DailyEvalDataPoint[]{
    let dataPoints=[]
    let numberOfColumns = 2 
    let numberOfRows = Math.ceil(count / numberOfColumns)
    let stepY = 0.3
    let stepX = stepY*5
    let baselineY = score - ((numberOfRows-1)/2)*stepY
    let baselineX = dosage - (numberOfColumns/2)*stepX/2

    for(let i=0 ; i<count ; i++){
      let nthColumn = (i) % numberOfColumns
      let displacedX = baselineX + nthColumn*stepX
      if(count%2 !==0 && i===count-1){
        displacedX = dosage
      }
      
      let nthRow = Math.floor(i / numberOfColumns) 
      let displacedY = baselineY + nthRow*stepY

      dataPoints.push({
        'x': displacedX,
        'y': displacedY,
        'type': type,
        'dosage': dosage,
        'value': score
      })
    }
    return dataPoints
  }

}