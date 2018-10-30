// @flow

import type {
  UserProfileObject,
  ComplianceReportObject,
  MeasurementObject,
  DailyEvaluationObject
} from "../libs/intecojs";
import {
  MeasurementTypes,
  UserRoles,
  SpasticityScales,
  ComplianceStatusOptions
} from "../libs/intecojs"

import { fakeRegimenObject } from "./fakeRegimen";

export const fakeUser = {
  uid: "r2CgLsZCgyN2jNxmYrXepqDYprn1", 
  email: "sprite728@gmail.com",
  password: "sprite728"
}

export const fakeUserProfile: UserProfileObject = {
  uid: fakeUser.uid,
  firstName: "Jeff",
  lastName: "Huang",
  email: fakeUser.email,
  role: UserRoles.patient
} 

export const fakeMeasurement: MeasurementObject = {
  id: "12345",
  uid: fakeUserProfile.uid,
  timestamp: 1535729800,
  type: MeasurementTypes.spasticitySeverity,
  value: SpasticityScales.mildPain
}

export const fakeComplianceReport: ComplianceReportObject = {
  id: "12345", 
  uid: fakeUserProfile.uid,
  regimenId: fakeRegimenObject.id,
  regimenPhase: fakeRegimenObject.regimenPhases[1].phase,
  treatmentId: fakeRegimenObject.regimenPhases[1].treatments[0].id,
  date: "2018-08-31", 
  lastUpdatedAtTimestamp: 1535732612, 
  status: ComplianceStatusOptions.undefined,

  expectedTreatmentTime: fakeRegimenObject.regimenPhases[1].treatments[1].time
}

export const fakeDailyEvaluation: DailyEvaluationObject = {
  id: "12345",
  uid: fakeUserProfile.uid,
  date: "2018-08-31",
  createdAtTimestamp: 1535729800,
  measurementsByType: {
    [MeasurementTypes.spasticitySeverity]: fakeMeasurement.value
  }
}