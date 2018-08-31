// @flow
import { Regimen } from "../models/regimen";
import type
{ MeasurementObject, MeasurementType,
  DailyEvaluationObject,
  ComplianceReportObject, 
  UserProfileObject
} from "../libs/intecojs";

interface IAppState {

  initialize(): Promise<void>;

  // User
  getUserProfile(): Promise<UserProfileObject>;
  updateUserProfile(profile: UserProfileObject): Promise<void>;
  
  // Regimen
  insertRegimen(regimen: Regimen): Promise<Regimen>;
  getRegimens(): Promise<Regimen[]>;
  getRegimen(id: string): Promise<Regimen>;
  getLatestRegimen(): Promise<Regimen>;
  updateRegimen(id: string, regimen: Regimen): Promise<void>;
  deleteRegimen(id: string): Promise<void>;
  deactivateRegimen(id: string): Promise<void>;

  // Compliance Reports
  getOrCreateComplianceReportsForDate(date: Date): Promise<ComplianceReportObject[]>;
  getComplianceReport(id: string): Promise<ComplianceReportObject>;
  getComplianceReportsByDate(date: Date): Promise<ComplianceReportObject[]>;
  getComplianceReportsByRegimenPhase(phaseId: string): Promise<ComplianceReportObject[]>;
  updateComplianceReport(id: string, obj: ComplianceReportObject): Promise<void>;
  deleteComplianceReport(id: string): Promise<void>;

  // Measurement Objects
  // Note that for measurements we use an Object directly instead of 
  // a wrapper class.
  insertMeasurement(obj: MeasurementObject): Promise<void>;
  getMeasurement(id: string): Promise<MeasurementObject>;
  getMeasurementsByDate(date: Date): Promise<MeasurementObject[]>;
  getMeasurementsByDateRange(startDate: Date, endDate: Date): Promise<MeasurementObject[]>;
  getMeasurementsByDateAndType(date: Date, type: MeasurementType): Promise<MeasurementObject[]>;
  updateMeasurement(id: string, obj: MeasurementObject): Promise<void>;
  deleteMeasurement(id: string): Promise<void>;

  // Daily Evaluation Reports
  insertDailyEval(obj: DailyEvaluationObject): Promise<void>;
  getDailyEval(id: string): Promise<DailyEvaluationObject>;
  getDailyEvalByDate(date: Date): Promise<DailyEvaluationObject>;
  getDailyEvalsByDateRange(startDate: Date, endDate: Date): Promise<DailyEvaluationObject[]>;
  updateDailyEvaluation(id: string, obj: DailyEvaluationObject): Promise<void>;
  deleteDailyEvaluation(id: string): Promise<void>;


}