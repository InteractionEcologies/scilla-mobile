// @flow
import type { 
  UserProfileObject,
  RegimenObject,
  MeasurementObject,
  ComplianceReportObject,
  DailyEvaluationObject,
  DateTypeISO8601,
  UserId
} from "../index";

import {
  generatePushIDFunc,
  IDataSource,
  NotImplementedError,
  NotExistError,
  PermissionDeniedError
} from "../index";
import moment from "moment";
import firebase from "firebase";
require("firebase/firestore");


const COLLECTION_USERPROFILES = "userprofiles"
const COLLECTION_REGIMENS = "regimens"
const COLLECTION_MEASUREMENTS = "measurements"
const COLLECTION_COMP_REPORTS = "complianceReports"
const COLLECTION_DAILY_EVALS = "dailyEvals"

type QuerySnapshot = $npm$firebase$firestore$QuerySnapshot;
// type FirebaseError = $npm$firebase$Error;
firebase.FirebaseError;

export class FirebaseDS implements IDataSource {
  db: firebase.firestore.Firestore;
  generatePushID: () => string;

  /* db: can be a web-based or native firestore instance. 
  */
  constructor(db: firebase.firestore.Firestore) {
    this.db = db;
    this.generatePushID = generatePushIDFunc();

    let settings = {
      timestampsInSnapshots: true
    };
    this.db.settings(settings);
  }

  /*******************************************************
   *  User Profile
   ******************************************************* 
   */

  upsertUserProfile(profile: UserProfileObject): Promise<void> {
    let uid = profile.uid; 
    return this.db.collection(COLLECTION_USERPROFILES)
      .doc(uid)
      .set(profile)
  }

  getUserProfile(uid: string): Promise<UserProfileObject> { 
    return this.db.collection(COLLECTION_USERPROFILES)
      .doc(uid)
      .get()
      .then( (doc) => {
        if(doc.exists) {
          return doc.data();
        } else {
          throw new NotExistError(`User Profile with id: ${uid} does not exist`);
        }
      })
  }
  
  /*******************************************************
   *  Regimen
   ******************************************************* 
   */

  upsertRegimen(regimen: RegimenObject): Promise<void> {
    return this.db.collection(COLLECTION_REGIMENS)
      .doc(regimen.id)
      .set(regimen)
  }

  updateRegimen(id: string, fieldsObj: Object): Promise<void> {
    return this.db.collection(COLLECTION_REGIMENS)
      .doc(id)
      .update(fieldsObj);
  }

  getRegimen(id: string): Promise<RegimenObject> {
    return this.db.collection(COLLECTION_REGIMENS)
      .doc(id)
      .get()
      .then( (doc) => {
        if(doc.exists) {
          return doc.data();
        } else {
          throw new NotExistError(`Regimen with id: ${id} does not exist`);
        }
      })
  }
  /**
   * @param  {string} uid
   * @returns Promise: a list of objects, each object represents a regimen
   */
  getRegimens(uid: string): Promise<RegimenObject[]> {
    return this.db.collection(COLLECTION_REGIMENS)
      .where("uid", "==", uid)
      .get()
      .then( (snapshot) => {
        return snapshot.docs.map( (docSnapshot) => {
          return docSnapshot.data();
        })
      });
  }

  getLatestRegimen(uid: string): Promise<RegimenObject> {
    return this.db.collection(COLLECTION_REGIMENS)
      .where('uid', "==", uid)
      .orderBy("startDate", "desc")
      .limit(1)
      .get()
      .then( (snapshot) => {
        return snapshot.docs[0].data();
      })
  }

  deleteRegimen(id: string): Promise<void> {
    return this.db.collection(COLLECTION_REGIMENS)
      .doc(id)
      .delete();
  }

  deleteRegimensOfUser(uid: string): Promise<void> {
    return this.db.collection(COLLECTION_REGIMENS)
    .where('uid', "==", uid)
    .get()
    .then( (snapshot) => {
      return this._batchDeleteObjects(snapshot);
    })
  }

  _batchDeleteObjects(snapshot: QuerySnapshot): Promise<void> {
    let batch = this.db.batch();
    snapshot.forEach( (doc) => {
      batch.delete(doc.ref);
    })
    return batch.commit();
  }

  /*******************************************************
   *  Compliance Reports
   ******************************************************* 
   */
  
  upsertComplianceReport(report: ComplianceReportObject): Promise<void> {
    return this.db.collection(COLLECTION_COMP_REPORTS)
      .doc(report.id)
      .set(report)
  }

  getComplianceReport(id: string): Promise<ComplianceReportObject> {
    return this.db.collection(COLLECTION_COMP_REPORTS)
      .doc(id)
      .get()
      .then( (doc) => {
        if(doc.exists) {
          return doc.data()
        } else {
          throw new NotExistError(`Compliance report with ${id} does not exist.`);
        }
      })
  }

  getComplianceReportsByDate (
    uid: UserId, date: DateTypeISO8601
  ): Promise<ComplianceReportObject[]> {
    return this.db.collection(COLLECTION_COMP_REPORTS)
      .where("uid", "==", uid)
      .where("date", "==", date)
      .get()
      .then( (snapshot) => {
        return snapshot.docs.map( (doc) => { return doc.data() })
      })
  }

  getComplianceReportsByDateRange (
    uid: UserId, startDate: DateTypeISO8601, endDate: DateTypeISO8601
  ): Promise<ComplianceReportObject[]> {
    return this.db.collection(COLLECTION_COMP_REPORTS)
      .where("uid", "==", uid)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get()
      .then( (snapshot) => {
        return this._parseQuerySnapshot(snapshot);
      })
  }

  getComplianceReportsByRegimenAndDate(
    uid: UserId, regimenId: string, date: DateTypeISO8601
  ): Promise<ComplianceReportObject[]> {
    return this.db.collection(COLLECTION_COMP_REPORTS)
      .where('uid', "==", uid)
      .where('regimenId', "==", regimenId)
      .where('date', "==", date)
      .get()
      .then( (snapshot) => {
        return this._parseQuerySnapshot(snapshot);
      })
  }
  
  getComplianceReportsByRegimenPhase (
    uid: UserId, regimenId: string, phase: number
  ): Promise<ComplianceReportObject[]> 
  {
    return this.db.collection(COLLECTION_COMP_REPORTS)
      .where("uid", "==", uid)
      .where("regimenId", "==", regimenId)
      .where("regimenPhase", "==", phase)
      .get()
      .then( (snapshot) => {
        return this._parseQuerySnapshot(snapshot)
      })
  }
  
  deleteComplianceReport(id: string): Promise<void> {
    return this.db.collection(COLLECTION_COMP_REPORTS)
      .doc(id)
      .delete();
  }

  deleteComplianceReportsOfUser(uid: string): Promise<void> {
    return this.db.collection(COLLECTION_COMP_REPORTS)
    .where('uid', "==", uid)
    .get()
    .then( (snapshot) => {
      return this._batchDeleteObjects(snapshot);
    })
  }
  
  /*******************************************************
   *  Measurement
   ******************************************************* 
   */
  upsertMeasurement(obj: MeasurementObject): Promise<any> {
    return this.db.collection(COLLECTION_MEASUREMENTS)
      .doc(obj.id)
      .set(obj)
  }

  getMeasurement(id: string): Promise<MeasurementObject> {
    return this.db.collection(COLLECTION_MEASUREMENTS)
      .doc(id)
      .get()
      .then( (doc) => {
        if(doc.exists) {
          return doc.data();
        } else {
          throw new NotExistError(`Measurement with id: ${id} does not exist.`)
        }
      })
  }
  getMeasurementsByDate(uid: UserId, date: DateTypeISO8601): Promise<MeasurementObject[]> {
    let startTs = moment(date).startOf('day').unix();
    let endTs = moment(date).endOf('day').unix();
    return this.db.collection(COLLECTION_MEASUREMENTS)
      .where("uid", "==", uid)
      .where("timestamp", ">=", startTs)
      .where("timestamp", "<=", endTs)
      .get()
      .then( (snapshot) => {
        return this._parseQuerySnapshot(snapshot);
      })
  }
  getMeasurementsByDateRange(
    uid: UserId, startDate: DateTypeISO8601, endDate: DateTypeISO8601
  ): Promise<MeasurementObject[]> {
    let startTs = moment(startDate).local().startOf('day').unix();
    let endTs = moment(endDate).local().endOf('day').unix();
    return this.db.collection(COLLECTION_MEASUREMENTS)
      .where("uid", "==", uid)
      .where("timestamp", ">=", startTs)
      .where("timestamp", "<=", endTs)
      .get()
      .then( (snapshot) => {
        return this._parseQuerySnapshot(snapshot);
      })
  }

  deleteMeasurement(id: string): Promise<void> {
    return this.db.collection(COLLECTION_MEASUREMENTS)
      .doc(id)
      .delete();
  }

  deleteMeasurementsOfUser(uid: string): Promise<void> {
    return this.db.collection(COLLECTION_MEASUREMENTS)
    .where('uid', "==", uid)
    .get()
    .then( (snapshot) => {
      return this._batchDeleteObjects(snapshot);
    })
  }

  /*******************************************************
   *  Daily Evaluations
   ******************************************************* 
    */
  
  upsertDailyEval(obj: DailyEvaluationObject): Promise<void> {
    return this.db.collection(COLLECTION_DAILY_EVALS)
      .doc(obj.id)
      .set(obj)
  }

  getDailyEval(id: string): Promise<DailyEvaluationObject> {
    return this.db.collection(COLLECTION_DAILY_EVALS)
      .doc(id)
      .get()
      .then( (doc) => {
        if(doc.exists) {
          return doc.data()
        } else {
          throw new NotExistError(`Daily evaluation with id ${id} does not exist.`);
        }
      })
  }

  getDailyEvalByDate(
    uid: UserId, date: DateTypeISO8601
  ): Promise<DailyEvaluationObject> {
    return this.db.collection(COLLECTION_DAILY_EVALS)
      .where("uid", "==", uid)
      .where("date", "==", date)
      .get()
      .then( (snapshot) => {
        if(snapshot.size > 1) {
          console.warn("More than one daily evaluation exists. Return the first one.")
          return snapshot.docs[0].data();
        } else if (snapshot.size === 1) {
          return snapshot.docs[0].data();
        } else {
          throw new NotExistError(`Daily evaluation of data ${date} does not exist.`)
        }
      })
  }

  getDailyEvalsByDateRange(
    uid: UserId, startDate: DateTypeISO8601, endDate: DateTypeISO8601
  ): Promise<DailyEvaluationObject[]> {
    return this.db.collection(COLLECTION_DAILY_EVALS)
      .where('uid', "==", uid)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get()
      .then( (snapshot) => {
        return this._parseQuerySnapshot(snapshot);
      })
      .catch( (error) => {
        console.warn(error);
        return Promise.reject(new PermissionDeniedError());
      })
  }

  deleteDailyEval(id: string): Promise<void> {
    return this.db.collection(COLLECTION_DAILY_EVALS)
      .doc(id)
      .delete()
      .catch( (error) => {
        return Promise.reject(
          new NotExistError(`Daily evaluation with id ${id} does not exist.`
        ));
      })
  }

  deleteDailyEvalsOfUser(uid: string): Promise<void> {
    return this.db.collection(COLLECTION_DAILY_EVALS)
    .where('uid', "==", uid)
    .get()
    .then( (snapshot) => {
      return this._batchDeleteObjects(snapshot);
    })
  }

  _parseQuerySnapshot(snapshot: QuerySnapshot): any[] {
    return snapshot.docs.map( (doc) => { return doc.data(); });
  }
}