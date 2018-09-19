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

export type MeasurementObject = {
  id: string, 
  uid: UserId,
  timestamp: number,
  type: MeasurementType, 
  value: any
};

export const MeasurementTypes = {
  sleepQuality: "Sleep Quality",
  spasticitySeverity: "Spasticity Severity",
  baclofenAmount: "Baclofen Amount",
  tiredness: "Tiredness",
  mood: "Mood",
};

export type MeasurementType = $Values<typeof MeasurementTypes>;
