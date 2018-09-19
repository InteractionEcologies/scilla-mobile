// @flow
// 8/3/2018
// `flow` kept generating error message on the type import below for unclear reasons, 
// I decided to leave this part out from flow type checking to stop the error message. 
import type
{
  DailyEvaluationObject,
  MeasurementObject,
  UserProfileObject,
  RegimenObject,
  ComplianceReportObject,
  DateTypeISO8601,
  UserId
} from "../index";


export interface IDataSource {
  // User Profile
  upsertUserProfile(profile: UserProfileObject): Promise<any>;
  getUserProfile(uid: UserId): Promise<any>;
  

  // Regimen
  upsertRegimen(regimen: RegimenObject): Promise<any>;
  updateRegimen(id: string, fieldsObj: Object): Promise<any>;
  getRegimens(uid: UserId): Promise<RegimenObject[]>;
  getLatestRegimen(uid: UserId): Promise<RegimenObject>;
  deleteRegimen(id: string): Promise<void>;
  deleteRegimensOfUser(uid: string): Promise<void>;


  // Compliance Reports
  upsertComplianceReport(report: ComplianceReportObject): Promise<void>;
  getComplianceReport(id: string): Promise<ComplianceReportObject>;
  
  getComplianceReportsByDate(uid: UserId, date: DateTypeISO8601
  ): Promise<ComplianceReportObject[]>;
  
  getComplianceReportsByDateRange(
    uid: UserId, startDate: DateTypeISO8601, endDate: DateTypeISO8601
  ): Promise<ComplianceReportObject[]>;
  
  getComplianceReportsByRegimenAndDate(
    uid: UserId, regimenId: string, date: DateTypeISO8601
  ): Promise<ComplianceReportObject[]>;

  getComplianceReportsByRegimenPhase(
    uid: UserId, regimenId: string, phase: number
  ): Promise<ComplianceReportObject[]>;
  deleteComplianceReport(id: string): Promise<void>;
  deleteComplianceReportsOfUser(uid: UserId): Promise<void>;


  // Measurements
  upsertMeasurement(obj: MeasurementObject): Promise<any>;
  getMeasurement(id: string): Promise<MeasurementObject>;
  getMeasurementsByDate(uid: UserId, date: DateTypeISO8601): Promise<MeasurementObject[]>;
  
  getMeasurementsByDateRange(
    uid: UserId, startDate: DateTypeISO8601, endDate: DateTypeISO8601
  ): Promise<MeasurementObject[]>;
  
  deleteMeasurement(id: string): Promise<void>;
  deleteMeasurementsOfUser(uid: string): Promise<void>;


  // Daily Evaluations
  upsertDailyEval(obj: DailyEvaluationObject): Promise<void>;
  getDailyEval(id: string): Promise<DailyEvaluationObject>;
  
  getDailyEvalByDate(
    uid: UserId, DateTypeISO8601: DateTypeISO8601
  ): Promise<DailyEvaluationObject>;
  
  getDailyEvalsByDateRange(
    uid: UserId, startDate: DateTypeISO8601, endDate: DateTypeISO8601
  ): Promise<DailyEvaluationObject[]>;
  
  deleteDailyEval(id: string): Promise<void>;
  deleteDailyEvalsOfUser(uid: string): Promise<void>;
};
