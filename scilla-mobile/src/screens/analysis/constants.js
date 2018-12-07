// @flow
import { MeasurementTypes } from "../../libs/intecojs";

export const ColorsForMeasurementTypes = {
  [MeasurementTypes.sleepQuality]: '#EA5656',
  [MeasurementTypes.spasticitySeverity]: '#5DAC3D',
  [MeasurementTypes.baclofenAmount]: '#0079D6',
  [MeasurementTypes.tiredness]: '#7200D6',
  [MeasurementTypes.mood]: '#FF9900'
}

export const DefaultColorForMeasurement = ColorsForMeasurementTypes[MeasurementTypes.sleepQuality];

export const PlottableMeasurementTypes = [
  MeasurementTypes.sleepQuality,
  MeasurementTypes.spasticitySeverity, 
  MeasurementTypes.tiredness, 
  MeasurementTypes.mood,
]