// @flow
import { Regimen } from "../models/regimen";
import type
{ MeasurementObject, MeasurementType,
  DailyEvaluationObject,
  ComplianceReportObject, 
  UserProfileObject,
  DateTypeISO8601
} from "../libs/intecojs";

export interface IAppState {

  initialize(): Promise<void>;

  // User
  getUserProfile(): Promise<UserProfileObject>;
  updateUserProfile(profile: UserProfileObject): Promise<void>;
  
  // Regimen
  insertRegimen(regimen: Regimen): Promise<Regimen>;
  getRegimens(): Promise<Regimen[]>;
  getLatestRegimen(): Promise<Regimen>;
  updateRegimen(id: string, regimen: Regimen): Promise<void>;
  deactivateRegimen(id: string): Promise<void>;

  // Compliance Reports
  getOrInitComplianceReportsForDate(date: DateTypeISO8601): Promise<ComplianceReportObject[]>;
  getComplianceReport(id: string): Promise<ComplianceReportObject>;
  getComplianceReportsByDate(date: DateTypeISO8601): Promise<ComplianceReportObject[]>;
  getComplianceReportsByRegimenPhase(regimenId: string, phase: number): Promise<ComplianceReportObject[]>;
  updateComplianceReport(obj: ComplianceReportObject): Promise<void>;
  
  // Measurement Objects
  // Note that for measurements we use an Object directly instead of 
  // a wrapper class.
  insertMeasurement(obj: MeasurementObject): Promise<void>;
  getMeasurement(id: string): Promise<MeasurementObject>;
  getMeasurementsByDate(date: DateTypeISO8601): Promise<MeasurementObject[]>;
  getMeasurementsByDateRange(startDate: DateTypeISO8601, endDate: DateTypeISO8601): Promise<MeasurementObject[]>;
  updateMeasurement(obj: MeasurementObject): Promise<void>;
  
  // Daily Evaluation Reports
  insertDailyEval(obj: DailyEvaluationObject): Promise<void>;
  getDailyEval(id: string): Promise<DailyEvaluationObject>;
  getDailyEvalByDate(date: DateTypeISO8601): Promise<DailyEvaluationObject>;
  getDailyEvalsByDateRange(startDate: DateTypeISO8601, endDate: DateTypeISO8601): Promise<DailyEvaluationObject[]>;
  updateDailyEval(obj: DailyEvaluationObject): Promise<void>;


}