// @flow

import type
 {
  UserId,
  MeasurementType,
  MeasurementObject,
} from '../index';

/********************************************
 * Time
 ********************************************
 */
export type DateTypeISO8601 = string;
export const DateFormatISO8601 = "YYYY-MM-DD";

export type DateTypeTimeOfDay = string;
export const DateFormatTimeOfDay = "HH:mm";

export const DateFormatUXFriendly = "MMM D, YYYY";

/********************************************
 * Regimen
 ********************************************
 */
export const RegimenTypes = {
  undefined: "undefined",
  incBaclofen: "incBaclofen",
  decBaclofen: "decBaclofen"
}

export type RegimenType = $Values<typeof RegimenTypes>;

export type RegimenObject = {
  id: string, // regimen id
  uid: UserId, 
  name: string,
  startDate: DateTypeISO8601, 
  endDate: DateTypeISO8601,
  type: RegimenType, 
  status: RegimenStatusOption, 
  regimenParam: RegimenParamObject, 
  regimenGoal: RegimenGoalOption,
  trackedMeasurementTypes: MeasurementType[], 
  regimenPhases: RegimenPhaseObject[], 
  reminderConfigs: ReminderConfigObject[]
};

export const RegimenStatusOptions = {
  active: "active",
  inactive: "inactive",
  paused: "paused",
};

export type RegimenStatusOption = $Values<typeof RegimenStatusOptions>;

export const RegimenParamKeys = {
  currentDoseMg: "currentDoseMg"
}

export type RegimenParamObject = {
  currentDoseMg?: number,
};

export const RegimenGoalOptions = {
  undefined: "undefined",
  baclofen30mg: "baclofen30mg",
  baclofen60mg: "balocfen60mg",
  baclofen0mg: "baclofen0mg",
};

export type RegimenGoalOption = $Values<typeof RegimenGoalOptions>;

/*************************************************
 * Regimen Phase
 * ***********************************************
 */
export type RegimenPhaseObject = {
  phase: number, // service as a unique id within a regimen.
  startDate: DateTypeISO8601, // YYYY-MM-DD
  endDate: DateTypeISO8601,
  treatments: TreatmentObject[],
};

/*************************************************
 * Treatment
 * ***********************************************
 */
export type TreatmentObject = {
  id: string,
  time: DateTypeTimeOfDay, 
  timeDesc?: string,
  option: TreatmentDetailOption,

  // TreatmentObject with the same reminderSlotId
  // shares the same reminder. 
  reminderSlotId: string
};

export const TreatmentDetailOptions = {
  baclofen5mg: "baclofen5mg",
  baclofen10mg: "baclofen10mg",
  baclofen15mg: "baclofen15mg",
  baclofen20mg: "baclofen20mg"
};

export type TreatmentDetailOption = $Values<typeof TreatmentDetailOptions>;

export const TreatmentOptions = {
  baclofen: "baclofen"
}

export type TreatmentOption = $Values<typeof TreatmentOptions>;

/*************************************************
 * Reminder
 * ***********************************************
 */
export const ReminderFrequencyOptions = {
  daily: "daily"
}

export type ReminderFrequencyOption = $Values<typeof ReminderFrequencyOptions>;

export type ReminderConfigObject = {
  id: string, 
  reminderSlotId: string, 
  order: number, 
  frequency: string, 
  time: DateTypeTimeOfDay, 
  treatmentDetailOption: TreatmentDetailOption | TreatmentOption,
}

export const UNDEFINED_TIMESTAMP = -1;
export const UNDEFINED_DATE = "0000-00-00";

export const ComplianceStatusOptions = {
  skip: "skip",
  took: "took",
  undefined: 'undefined'
}
export type ComplianceStatus = $Values<typeof ComplianceStatusOptions>;

export type ComplianceReportObject = {
  id: string,
  uid: UserId,
  regimenId: string,
  regimenPhase: number,
  treatmentId: string, 
  date: DateTypeISO8601, 
  lastUpdatedAtTimestamp: number, 
  status: ComplianceStatus,

  expectedTreatmentTime: DateTypeTimeOfDay 
}

export type DailyEvaluationObject = {
  id: string, 
  uid: UserId,
  date: DateTypeISO8601, 
  createdAtTimestamp: number,
  measurementsByType: {
    [measurementType: MeasurementType]: MeasurementObject
  }
}