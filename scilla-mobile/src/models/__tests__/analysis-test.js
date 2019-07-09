// @flow
import { DailyEvalDataFrame } from "../analysis";
import { 
    MeasurementTypes
} from "../../libs/scijs";
import _ from "lodash";

describe("daily evaluation data frame", () => {

  let fakeDailyEvalDataPoints = [
    {
      type: MeasurementTypes.sleepQuality,
      dosage: 5,
      value: 1
    },
    {
      type: MeasurementTypes.sleepQuality,
      dosage: 5,
      value: 3
    },
    {
      type: MeasurementTypes.sleepQuality,
      dosage: 10,
      value: 2
    },
        {
      type: MeasurementTypes.sleepQuality,
      dosage: 15,
      value: 3
    },
      
  ]

  it('summarize', () => {
    let df = new DailyEvalDataFrame();
    df.addDataPoints(fakeDailyEvalDataPoints);
    df.summarize();
    expect(df.summary).toMatchObject({
      [MeasurementTypes.sleepQuality]: {
        "5": {
          "1": 1,
          "3": 1,
          "mean": 2
        },
        "10": {
          "2": 1, 
          "mean": 2
        },
        "15": {
          "3": 1,
          "mean": 3
        },
      }
    })

  });

  it('get mean data points', () => {
    let df = new DailyEvalDataFrame();
    df.addDataPoints(fakeDailyEvalDataPoints);
    let meanPoints = df.getMeanDataPointsByTypes([MeasurementTypes.sleepQuality]);
    // console.log(meanPoints);
    meanPoints = _.sortBy(meanPoints, 'dosage');
    expect(meanPoints[0].value).toEqual(2);
    expect(meanPoints[1].value).toEqual(2);
    expect(meanPoints[2].value).toEqual(3);
  
  });

  

})