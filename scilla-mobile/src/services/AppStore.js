// @flow
import { IRegimen, RegimenFactory } from "../libs/scijs";
import AppService from "./AppService";
import { IAppStore } from "./IAppStore";
import { 
  RegimenStatusOptions,
  DateFormatISO8601,
  NotExistError
} from "../libs/scijs";
import type { 
  UserId,
  MeasurementObject, 
  DailyEvaluationObject,
  ComplianceReportObject, 
  UserProfileObject,
  RegimenObject,
  DateTypeISO8601
} from "../libs/scijs";
import _ from "lodash";
import moment from "moment";
import AppClock from "./AppClock"

const appClock = new AppClock();

const SCOPE = "AppStore:";
/* AppStore Singleton 
 * This is a layer that abstract cloud persistence storage and 
 * local cache to support offline mode. It also allow
 * composition of multiple datasource calls into one method. 
 * 
 * TODO: detach Expo to use `react-native-firebase`
 * Currently there is no caching code in this class, this is because
 * Firebase offers offline mode in its iOS and Android SDK. We will 
 * Switch to use `react-native-firebase` that leverages native Firebase
 * SDK once the views are mostly completed. Switching should not be
 * challenging. 
 * 
 * See here for detail: 
 * - https://firebase.google.com/docs/firestore/manage-data/enable-offline
 */
export default class AppStore implements IAppStore { 

  static instance: AppStore
  // appService = AppService.instance;
  appService = new AppService();
  
  
  latestRegimen: ?IRegimen;
  lastCheckPhaseUpdateTime = appClock.now().subtract(1, 'day');
  
  complianceReportMap: {
    [date: DateTypeISO8601]: {
      [id: string]: ComplianceReportObject
    }
  } = {}

  complianceReportObserver: any

  constructor() {
    if(!AppStore.instance) {
      AppStore.instance = this;
    } 
    return AppStore.instance;
  }
  /**
   * Initialize data related to a user. This is called 
   * after user login, currently in DashboardMainScreen. 
   * @param  {moment=appClock.now(} today
   * @returns Promise
   */
  initialize(today: moment = appClock.now()): Promise<void> {
    console.log(SCOPE, "initialize");
    return Promise.all([
      this.getUserProfile(),
      this.getLatestRegimen()
    ])
    .then(() => {
      this.observeComplianceReports();
    })
    .catch( (error) => {
      // console.log(error);
      if (error.name === "NotExisterror") {
        console.log("Regimen does not exist.")
      }
    });
  }

  observeComplianceReports = () => {
    if (this.latestRegimen == null) return;
    
    // unsubscribe the previous subscription. 
    if (this.complianceReportObserver) {
      this.complianceReportObserver();
    }

    this.complianceReportObserver = this.appService.ds
      .observeComplianceReportsByRegimen(
        this.uid, 
        this.latestRegimen.id, 
        this.onUpdatedComplianceReports
      )
  }

  onUpdatedComplianceReports = (reports: ComplianceReportObject[]) => {
    
    _.forEach(reports, (report: ComplianceReportObject) => {
      if ( _.has(this.complianceReportMap, report.date)) {
        this.complianceReportMap[report.date][report.id] = report
      } else {
        this.complianceReportMap[report.date] = {}
        this.complianceReportMap[report.date][report.id] = report
      }
    })

    // console.log(SCOPE, "onUpdatedComplianceReports", this.complianceReportMap);
  }

  get uid() {
    return this._getUid();
  }

  _getUid(): UserId {
    try {
      const { currentUser} = this.appService.auth;
      return currentUser.uid
    } catch(e) {
      throw Error("User has not signed in.")
    }
  }

  getUserProfile(): Promise<UserProfileObject> {
    return this.appService.ds.getUserProfile(this.uid);
  }

  updateUserProfile(profile: UserProfileObject): Promise<void> {
    return this.appService.ds.upsertUserProfile(profile);
  }

  shouldCheckRegimenPhaseUpdate(): boolean {
    if (this.lastCheckPhaseUpdateTime.isBefore(moment(), 'day')) {
      return true;
    } else {
      return false;
    }
  }

  hasActiveRegimen(): boolean {
    if(this.uid
      && this.latestRegimen) {
      return true;
    } else {
      return false;
    }
  }

  resetRegimenCache() {
    this.latestRegimen = null;
  }

  insertRegimen(regimen: IRegimen): Promise<IRegimen> {
    return this.appService.ds.upsertRegimen(regimen.toObj());
  }

  getRegimens(): Promise<IRegimen[]> {
    return this.appService.ds.getRegimens(this.uid)
      .then( (objs) => {
        return _.map(objs, (obj) => {
          return RegimenFactory.createRegimenFromObj(obj); 
        })
      })
  }

  getLatestRegimen(): Promise<IRegimen> {
    if(this.latestRegimen) {
      return Promise.resolve(this.latestRegimen)
    } else {
      return this.appService.ds.getLatestRegimen(this.uid)
        .then( (obj) => {
          this._cacheLatestRegimenFromObj(obj);
          return ((this.latestRegimen:any):IRegimen);
        })
        .catch( (error) => {
          throw new NotExistError("Regimen does not exist")
        })
    }

    // return this.appService.ds.getLatestRegimen(this.uid)
    //   .then((regimenObj) => {
    //     return RegimenFactory.createRegimenFromObj(regimenObj);
    //   })
    //   .catch( (error) => {
    //     throw new NotExistError("Regimen does not exist");
    //   })
    // ;
  }

  updateRegimen(regimen: IRegimen): Promise<void> {
    let cachedRegimenId = _.get(this, 'latestRegimen.id', null);
    let cacheUpdateRequired = regimen.id === cachedRegimenId;
    let regimenObj = regimen.toObj();

    return this.appService.ds.upsertRegimen(regimenObj)
      .then( () => {
        if(cacheUpdateRequired) {
          this._cacheLatestRegimenFromObj(regimenObj)
        }
      })
  }

  // _cacheLatestRegimen(regimen: IRegimen) {
  //   let regimenObj = regimen.toObj();
  //   this._cacheLatestRegimenFromObj(regimenObj);
  // }

  _cacheLatestRegimenFromObj(regimenObj: RegimenObject) {
    this.latestRegimen = RegimenFactory.createRegimenFromObj(regimenObj);
  }

  deactivateRegimen(id: string): Promise<void> {
    let cachedRegimenId = _.get(this, 'latestRegimen.id', null);
    let updateRequired = id === cachedRegimenId;

    return this.appService.ds.updateRegimen(
      id, {status: RegimenStatusOptions.inactive}
    ).then( () => {
      if(updateRequired && this.latestRegimen) {
        this.latestRegimen.setStatus(RegimenStatusOptions.inactive);
      }
    })
  }

  getOrInitComplianceReportsForDate(
    date: moment
  ): Promise<ComplianceReportObject[]> {
    let currentRegimen;
    let existingReports: ComplianceReportObject[];
    let missingReports: ComplianceReportObject[];

    return this.getLatestRegimen()
      .then( (regimen) => {
        currentRegimen = regimen;
        // return this.appService.ds
        //   .getComplianceReportsByRegimenAndDate(this.uid, regimen.id, date.format(DateFormatISO8601));
        return this._getComplianceReportsByRegimenAndDateWithCache(this.uid, regimen.id, date.format(DateFormatISO8601));
      })
      .then( (reports) => {
        existingReports = reports;
        missingReports = currentRegimen.createMissingComplianceReports(date, reports);
        return this._initMissingComplianceReports(missingReports);
      })
      .then( () => {
        // Merge and sort compliance reports for a date.
        let reports = existingReports.concat(missingReports);
        return _.sortBy(reports, ['treatmentId']);
      })
  }

  _getComplianceReportsByRegimenAndDateWithCache(
    uid: UserId, 
    regimenId: string, 
    date: DateTypeISO8601): Promise<ComplianceReportObject[]> 
  {

    if (this.latestRegimen && regimenId === this.latestRegimen.id) {
      // Look up cache 
      if(_.has(this.complianceReportMap, date)) {
        return Promise.resolve(_.values(this.complianceReportMap[date]))
      } else {
        return this.appService.ds
          .getComplianceReportsByRegimenAndDate(uid, regimenId, date)
      }
    } else {
      return this.appService.ds
        .getComplianceReportsByRegimenAndDate(uid, regimenId, date);
    }
  }

  _initMissingComplianceReports(reports: ComplianceReportObject[]): Promise<void> {
    // Create missing reports
    let promises: Promise<void>[] = [];
    for(let report of reports) {
      promises.push(this.appService.ds.upsertComplianceReport(report));
    }
    return Promise.all(promises).then(()=>{});
  }

  getComplianceReport(id: string): Promise<ComplianceReportObject> {
    return this.appService.ds.getComplianceReport(id);
  }

  getComplianceReportsByDate(date: moment): Promise<ComplianceReportObject[]> {
    return this.appService.ds.getComplianceReportsByDate(
      this.uid, 
      date.format(DateFormatISO8601)
    );
  }

  getComplianceReportsByRegimenPhase(
    regimenId: string, phase: number
  ): Promise<ComplianceReportObject[]> {
    return this.appService.ds
      .getComplianceReportsByRegimenPhase(this.uid, regimenId, phase)
  }

  updateComplianceReport(obj: ComplianceReportObject): Promise<void> {
    return this.appService.ds
      .upsertComplianceReport(obj)
  }

  insertMeasurement(obj: MeasurementObject): Promise<void> {
    return this.appService.ds
      .upsertMeasurement(obj);
  }

  getMeasurement(id: string): Promise<MeasurementObject> {
    return this.appService.ds
      .getMeasurement(id);
  }

  getMeasurementsByDate(date: moment): Promise<MeasurementObject[]> {
    return this.appService.ds
      .getMeasurementsByDate(this.uid, date.format(DateFormatISO8601));
  }

  getMeasurementsByDateRange(
    startDate: moment, endDate: moment
  ): Promise<MeasurementObject[]> {
    return this.appService.ds
      .getMeasurementsByDateRange(
        this.uid, 
        startDate.format(DateFormatISO8601), 
        endDate.format(DateFormatISO8601)
      );
  }
  
  updateMeasurement(obj: MeasurementObject): Promise<void> {
    return this.appService.ds
      .upsertMeasurement(obj);
  }

  insertDailyEval(obj: DailyEvaluationObject): Promise<void> {
    return this.appService.ds
      .upsertDailyEval(obj);
  }
  
  getDailyEval(id: string): Promise<DailyEvaluationObject> {
    return this.appService.ds
      .getDailyEval(id);
  }
  
  /**
   * @throws {Error} daily eval for this date does not exist. 
   */
  getDailyEvalByDate(date: moment): Promise<DailyEvaluationObject> {
    return this.appService.ds
      .getDailyEvalByDate(this.uid, date.format(DateFormatISO8601));
  }

  getDailyEvalsByDateRange(
    startDate: moment, endDate: moment
  ): Promise<DailyEvaluationObject[]> {
    return this.appService.ds
      .getDailyEvalsByDateRange(
        this.uid, 
        startDate.format(DateFormatISO8601),
        endDate.format(DateFormatISO8601)
      );
  }

  updateDailyEval(obj: DailyEvaluationObject): Promise<void> {
    return this.appService.ds
      .upsertDailyEval(obj);
  }

  async signOut() {
    await this.appService.auth.signOut();
    // Make sure we clean up observers. 
    if(this.complianceReportObserver) {
      this.complianceReportObserver();
      this.complianceReportObserver = null;
    }
    
    if(this.latestRegimen) {
      this.latestRegimen = null;
    }
  }

}
