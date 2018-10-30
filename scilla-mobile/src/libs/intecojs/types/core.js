// @flow

export type UserId = string

export const UserRoles = {
  patient: "patient", 
  primaryCaregiver: "primaryCaregiver",
  secondaryCaregiver: "secondaryCaregiver",
  clinician: "clinician"
}

export type UserRole = $Values<typeof UserRoles>

export type UserProfileObject = {
  uid: UserId,
  firstName: string, 
  lastName: string, 
  email: string, 
  role: UserRole,
};

/********************************************
 * Measurement
 ********************************************
 */
export type MeasurementSharingPolicyObject = {
  id: string,
  owner: UserId, 
  receivers: UserId[],
  measurementType: MeasurementType,
};

export type MeasurementValue = string | number | bool;
export type MeasurementObject = {
  id: string, 
  uid: UserId,
  timestamp: number,
  type: MeasurementType, 
  value: MeasurementValue
};

export const MeasurementTypes = {
  sleepQuality: "Sleep Quality",
  spasticitySeverity: "Spasticity Severity",
  baclofenAmount: "Baclofen Amount",
  tiredness: "Tiredness",
  mood: "Mood",

  // For daily eval only
  exerciseTime: "Exercise Time",
  botox: "Botox",
  triggerPointInjection: "Trigger Point Injection",
  accupuncture: "Accupuncture",
  physicalTherapy: "Physical Therapy",
  memo: "Memo"
};

export type MeasurementType = $Values<typeof MeasurementTypes>;

export const AdditionalMeasurementTypesForDailyEval = {
  exerciseTime: "Exercise Time",
  medication: "Medication",
  memo: "Memo"
}

export const MedicationTypes = {
  botox: "Botox",
  triggerPointInjection: "Trigger Point Injection",
  accupuncture: "Accupuncture",
  physicalTherapy: "Physical Therapy",
}