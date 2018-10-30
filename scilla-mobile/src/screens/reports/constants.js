// @flow
import { MeasurementTypes } from "../../libs/intecojs";

export const RequiredMeasurementTypesInDailyEval = [
  MeasurementTypes.exerciseTime,
  MeasurementTypes.memo
]

export const RequiredCheckboxMeasurementTypesInDailyEval = [
  MeasurementTypes.botox,
  MeasurementTypes.triggerPointInjection,
  MeasurementTypes.accupuncture,
  MeasurementTypes.physicalTherapy
]

// A question with lower number will be shown first in daily evaluation
export const DailyEvalQuestionPriorityMap = {
  [MeasurementTypes.spasticitySeverity]: 1,
  [MeasurementTypes.tiredness]: 2,
  [MeasurementTypes.mood]: 3,
  [MeasurementTypes.sleepQuality]: 4,
  [MeasurementTypes.baclofenAmount]: 5,


  [MeasurementTypes.exerciseTime]: 10,
  [MeasurementTypes.medication]: 11,

  [MeasurementTypes.botox]: 20, 
  [MeasurementTypes.triggerPointInjection]: 21, 
  [MeasurementTypes.accupuncture]: 22, 
  [MeasurementTypes.physicalTherapy]: 23, 
  
  [MeasurementTypes.memo]: 30
}