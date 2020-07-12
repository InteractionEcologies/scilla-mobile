// @flow
import * as firebase from "firebase";
import { FirebaseDS,
  Utils, DateFormatISO8601,
} from "../libs/scijs"
import { FirebaseConfig } from "../constants/FirebaseConfig";
import { 
  fakeUser, 
  fakeUserProfile, 
  fakeComplianceReport,
  fakeMeasurement,
  fakeDailyEvaluation
} from "../libs/scijs";
import { fakeRegimenObject } from "../libs/scijs";
import _ from "lodash";
import moment from "moment";

describe("FirebaseDS with Web SDK", () => {
  firebase.initializeApp(FirebaseConfig);
  const auth = firebase.auth();
  const ds = new FirebaseDS(firebase.firestore());

  beforeAll(async () => {
    await auth.signInWithEmailAndPassword(fakeUser.email, fakeUser.password);
    await createUserProfile();
    await createRegimen();
    await createComplianceReport(); 
    await createMeasurement();
    await createDailyEval();
  })

  afterAll(async () => {
    // Must signout otherwise auth will preserve data renfereces that 
    // cause jest to continue running. 
    let uid = getUid();
    await ds.deleteRegimensOfUser(uid);
    await ds.deleteComplianceReportsOfUser(uid);
    await ds.deleteMeasurementsOfUser(uid);
    await ds.deleteDailyEvalsOfUser(uid);
    await auth.signOut();
    return firebase.app().delete();
  })

  function getUid() {
    if(auth.currentUser) {
      return auth.currentUser.uid
    } else {
      throw Error("No user has been signed in.")
    }
  }

  function getFakeRegimen() {
    let myFakeRegimenObject = _.cloneDeep(fakeRegimenObject);
    let uid = getUid()
    myFakeRegimenObject.uid = uid;
    return myFakeRegimenObject;
  }

  function getFakeComplianceReport() {
    let cp = _.clone(fakeComplianceReport);
    let uid = getUid();
    cp.uid = uid;
    return cp;
  }

  function getFakeMeasurement() {
    let m = _.clone(fakeMeasurement);
    m.uid = getUid();
    return m;
  }

  function getFakeDailyEval() {
    let dailyEval = _.cloneDeep(fakeDailyEvaluation);
    dailyEval.uid = getUid();
    return dailyEval;
  }

  function createUserProfile() {
    return ds.upsertUserProfile(fakeUserProfile);
  }

  function createRegimen() {
    let myRegimenObj = getFakeRegimen();
    return ds.upsertRegimen(myRegimenObj);
  }

  function createComplianceReport() {
    let obj = getFakeComplianceReport();
    return ds.upsertComplianceReport(obj)
  }

  function createMeasurement() {
    let obj = getFakeMeasurement();
    return ds.upsertMeasurement(obj);
  }

  function createDailyEval() {
    let obj = getFakeDailyEval();
    return ds.upsertDailyEval(obj);
  }

  it("Create and get user profile", async () => {
    await ds.upsertUserProfile(fakeUserProfile)
    let userprofile = await ds.getUserProfile(fakeUserProfile.uid)
    expect(userprofile.uid).toEqual(fakeUserProfile.uid);
  })

  it('Update user profile', async () => {
    let randomFirstName = Utils.randomId();
    let profile = await ds.getUserProfile(fakeUserProfile.uid)
    profile.firstName = randomFirstName
    await ds.upsertUserProfile(profile)
    let newProfile = await ds.getUserProfile(fakeUserProfile.uid)
    expect(newProfile.firstName).toEqual(randomFirstName)
  })

  it('Create regimen', async () => {
    let fakeRegimenObj = getFakeRegimen();
    await ds.upsertRegimen(fakeRegimenObj)
    let regimenObj = await ds.getRegimen(fakeRegimenObj.id);
    expect(regimenObj).toMatchObject(fakeRegimenObj);
  })  

  it('Get regimens of a user', async () => {
    if(auth.currentUser) {
      let uid = auth.currentUser.uid;
      let regimenObjs = await ds.getRegimens(uid);
      expect(regimenObjs.length).toBeGreaterThanOrEqual(1);
    }
  })

  it.skip('Get the latest regimen', async () => {
    let uid = getUid();

    let oldRegimenObj = getFakeRegimen();
    oldRegimenObj.id = ds.generatePushID();

    // Long time ago
    oldRegimenObj.startDate = "2010-01-01"
    oldRegimenObj.endDate = "2010-02-01"

    await ds.upsertRegimen(oldRegimenObj);
    let latestRegimenObj = await ds.getLatestRegimen(uid);
    expect(latestRegimenObj.startDate).toEqual(fakeRegimenObject.startDate)
    expect(latestRegimenObj.endDate).toEqual(fakeRegimenObject.endDate)

    await ds.deleteRegimen(oldRegimenObj.id);
  })

  it('Upsert and get compliance report', async () => {
    let cp = getFakeComplianceReport();
    await ds.upsertComplianceReport(cp);
    let persistedReport = await ds.getComplianceReport(cp.id);
    expect(persistedReport.id).toEqual(cp.id);
    expect(persistedReport).toMatchObject(cp);
  })

  it('Get compliance reports by date', async () => {
    let uid = getUid();
    let anotherReport = getFakeComplianceReport();
    anotherReport.id = ds.generatePushID();
    await ds.upsertComplianceReport(anotherReport);
    let reports = await ds.getComplianceReportsByDate(uid, fakeComplianceReport.date);
    await ds.deleteComplianceReport(anotherReport.id);

    expect(reports).toHaveLength(2);
  })

  it("Get compliance reports by a range of date", async () => {
    let uid = getUid();
    let oldReport = getFakeComplianceReport();
    oldReport.id = ds.generatePushID();
    oldReport.date = "2010-01-01";
    await ds.upsertComplianceReport(oldReport);
    let reports = await ds.getComplianceReportsByDateRange(
      uid, oldReport.date, fakeComplianceReport.date
    )
    await ds.deleteComplianceReport(oldReport.id);
    
    expect(reports).toHaveLength(2);
    expect(reports[0].date).toEqual(oldReport.date);
    expect(reports[1].date).toEqual(fakeComplianceReport.date);
  })

  it("Get a compliance report by regimen id, phase", async () => {
    let uid = getUid();
    let regimenId = fakeComplianceReport.regimenId;
    let phase = fakeComplianceReport.regimenPhase;
    let reports = await ds.getComplianceReportsByRegimenPhase(uid, regimenId, phase);
    expect(reports).toHaveLength(1);
    expect(reports[0]).toMatchObject(fakeComplianceReport);
  })

  it("Create, get and delete a measurement", async () => {
    let m = getFakeMeasurement();
    m.id = ds.generatePushID();
    await ds.upsertMeasurement(m);
    let persistedMeasurement = await ds.getMeasurement(m.id);
    await ds.deleteMeasurement(m.id);

    expect(persistedMeasurement).toMatchObject(m);

  })

  it("Get measurements by date", async () => {
    let uid = getUid();
    let date = moment.unix(fakeMeasurement.timestamp).format(DateFormatISO8601);
    
    let measurements = await ds.getMeasurementsByDate(uid, date);
    expect(measurements).toHaveLength(1);
    expect(measurements[0]).toMatchObject(fakeMeasurement);
  });

  it("Get measurements by date range", async () => {
    let uid = getUid();
    let endDate = moment.unix(fakeMeasurement.timestamp).local();
    let startDate = endDate.clone().subtract(7, 'days');

    let anotherMeasurement = getFakeMeasurement();
    anotherMeasurement.id = ds.generatePushID();
    anotherMeasurement.timestamp = startDate.unix();

    await ds.upsertMeasurement(anotherMeasurement);
    
    let startDateStr = startDate.format(DateFormatISO8601);
    let endDateStr = endDate.format(DateFormatISO8601);

    let measurements = await ds.getMeasurementsByDateRange(
      uid, startDateStr, endDateStr
    );

    await ds.deleteMeasurement(anotherMeasurement.id);

    expect(measurements).toHaveLength(2);
    expect(measurements[0]).toMatchObject(anotherMeasurement);
    expect(measurements[1]).toMatchObject(fakeMeasurement);
  });

  it('Create, get and delete daily evaluation', async () => {
    let dailyEval = getFakeDailyEval();
    dailyEval.id = ds.generatePushID();

    await ds.upsertDailyEval(dailyEval);
    let persistedDailyEval = await ds.getDailyEval(dailyEval.id);

    let result = await ds.deleteDailyEval(dailyEval.id);

    expect(persistedDailyEval).toMatchObject(dailyEval);

    await expect( 
      ds.getDailyEval(dailyEval.id)
    ).rejects.toThrow(Error);

  })

  it('Throw error when deleting daily eval not exist', async () => {
    await expect(
      ds.deleteDailyEval("-LLHjR_YnUovYK6uHazn")
    ).rejects.toThrow(Error)
  })

  it('Get daily eval by date range', async () => {
    let dailyEval = getFakeDailyEval();
    let oldDailyEval = getFakeDailyEval();
    let oldDate = moment(oldDailyEval.date).subtract(7, 'days');
    let oldDateStr = oldDate.format(DateFormatISO8601);
    
    oldDailyEval.id = ds.generatePushID();
    oldDailyEval.date = oldDateStr
    oldDailyEval.createdAtTimestamp = oldDate.unix();
    await ds.upsertDailyEval(oldDailyEval);

    let dailyEvals = await ds.getDailyEvalsByDateRange(
      getUid(), oldDailyEval.date, fakeDailyEvaluation.date 
    )

    await ds.deleteDailyEval(oldDailyEval.id);

    expect(dailyEvals).toHaveLength(2);
    expect(dailyEvals[1]).toMatchObject(oldDailyEval);
    expect(dailyEvals[0]).toMatchObject(dailyEval);
  })


})