// @flow
import { MeasurementTypes } from "../../libs/scijs";

export const AdditionalMeasurementViewTypes = {
  additionalTreatment: 'Additional Treatment',
  additionalIlliness: "Additional Illiness"
}

export const RequiredAdditionalMeasurementTypes = [
  // MeasurementTypes.exerciseTime,
  MeasurementTypes.memo
]

export const RequiredAdditionalTreatmentMeasurementTypes = [
  MeasurementTypes.botox,
  MeasurementTypes.triggerPointInjection,
  MeasurementTypes.accupuncture,
  MeasurementTypes.physicalTherapy
]

export const RequiredAdditionalIllinessMeasurementTypes = [
  MeasurementTypes.runnyNose, 
  MeasurementTypes.sneezing, 
  MeasurementTypes.coughing, 
  MeasurementTypes.soreThroat, 
  MeasurementTypes.feelingUnderTheWeather, 
  MeasurementTypes.headache, 
  MeasurementTypes.chills
]

// A question with lower number will be shown first in daily evaluation
export const DailyEvalQuestionPriorityMap = {
  [MeasurementTypes.muscleTightness]: 0,
  [MeasurementTypes.spasticitySeverity]: 1,
  [MeasurementTypes.sleepiness]: 2, 
  [MeasurementTypes.weakness]: 3,
  [MeasurementTypes.tiredness]: 4,
  [MeasurementTypes.mood]: 5,
  [MeasurementTypes.sleepQuality]: 6,
  [MeasurementTypes.baclofenAmount]: 7,


  [MeasurementTypes.exerciseTime]: 10,
  [MeasurementTypes.medication]: 11,

  [MeasurementTypes.botox]: 20, 
  [MeasurementTypes.triggerPointInjection]: 21, 
  [MeasurementTypes.accupuncture]: 22, 
  [MeasurementTypes.physicalTherapy]: 23, 
  
  [MeasurementTypes.memo]: 30,

  [MeasurementTypes.respiratoryMovement]: 100, 
  [MeasurementTypes.dizziness]: 101
}
