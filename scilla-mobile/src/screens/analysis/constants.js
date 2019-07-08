// @flow
import { MeasurementTypes } from "../../libs/scijs";

export const ColorsForMeasurementTypes = {
  [MeasurementTypes.muscleTightness]: '#3C74AC',
  [MeasurementTypes.tiredness]: '#EB7F59',
  [MeasurementTypes.weakness]: "#34A96E",
  [MeasurementTypes.dizziness]: "#D34653",
  [MeasurementTypes.sleepiness]: "#8273AF",
  [MeasurementTypes.mood]: '#987762',

  // deprecated measurements
  [MeasurementTypes.sleepQuality]: '#E589C0',
  [MeasurementTypes.spasticitySeverity]: '#8C8C8C',
  [MeasurementTypes.baclofenAmount]: '#D1B77C',
}

export const DefaultColorForMeasurement = ColorsForMeasurementTypes[MeasurementTypes.sleepQuality];

export const PlottableMeasurementTypes = [

  MeasurementTypes.spasticitySeverity, 
  MeasurementTypes.muscleTightness,
  MeasurementTypes.tiredness, 
  MeasurementTypes.weakness,
  MeasurementTypes.dizziness, 
  MeasurementTypes.sleepiness,
  MeasurementTypes.mood,
]