// @flow
import moment from "moment";
import { IRegimen } from "../libs/scijs/models/regimen";
import type
{ MeasurementObject, 
  DailyEvaluationObject,
  ComplianceReportObject, 
  UserProfileObject,
  DateTypeISO8601
} from "../libs/scijs";

export interface IAppStore {

  initialize(): Promise<void>;

  // User
  getUserProfile(): Promise<UserProfileObject>;
  updateUserProfile(profile: UserProfileObject): Promise<void>;
  
  shouldCheckRegimenPhaseUpdate(): boolean;

  // Regimen
  hasActiveRegimen(): boolean;
  insertRegimen(regimen: IRegimen): Promise<IRegimen>;
  getRegimens(): Promise<IRegimen[]>;
  getLatestRegimen(): Promise<IRegimen>;
  updateRegimen(regimen: IRegimen): Promise<void>;
  deactivateRegimen(id: string): Promise<void>;

  // Compliance Reports
  getOrInitComplianceReportsForDate(date: moment): Promise<ComplianceReportObject[]>;
  getComplianceReport(id: string): Promise<ComplianceReportObject>;
  getComplianceReportsByDate(date: moment): Promise<ComplianceReportObject[]>;
  getComplianceReportsByRegimenPhase(regimenId: string, phase: number): Promise<ComplianceReportObject[]>;
  updateComplianceReport(obj: ComplianceReportObject): Promise<void>;
  
  // Measurement Objects
  // Note that for measurements we use an Object directly instead of 
  // a wrapper class.
  insertMeasurement(obj: MeasurementObject): Promise<void>;
  getMeasurement(id: string): Promise<MeasurementObject>;
  getMeasurementsByDate(date: moment): Promise<MeasurementObject[]>;
  getMeasurementsByDateRange(startDate: moment, endDate: moment): Promise<MeasurementObject[]>;
  updateMeasurement(obj: MeasurementObject): Promise<void>;
  
  // Daily Evaluation Reports
  insertDailyEval(obj: DailyEvaluationObject): Promise<void>;
  getDailyEval(id: string): Promise<DailyEvaluationObject>;
  getDailyEvalByDate(date: moment): Promise<DailyEvaluationObject>;
  getDailyEvalsByDateRange(startDate: moment, endDate: moment): Promise<DailyEvaluationObject[]>;
  updateDailyEval(obj: DailyEvaluationObject): Promise<void>;


}