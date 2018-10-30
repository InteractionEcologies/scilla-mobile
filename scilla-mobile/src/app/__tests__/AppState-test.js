// @flow
import AppState from "../AppState";
import { AppServiceImplWithFirebaseWeb } from "../AppServiceImplWithFirebaseWeb";
import { fakeUser } from "../../datafixtures/core";
import { fakeRegimenObject } from "../../datafixtures/fakeRegimen";
import {
  UserRoles, DateFormatISO8601, UNDEFINED_TIMESTAMP, UNDEFINED_DATE, ComplianceStatusOptions
} from "../../libs/intecojs"
import _ from "lodash";
import moment from "moment";

describe('AppState with AppService implemented with Firebase Web SDK', () => {
  const appState = new AppState();
  appState.appService = new AppServiceImplWithFirebaseWeb();
  const appService = appState.appService;
  appService.initialize({disableAuthPersistence: true});

  beforeAll(async () => {
    await appService.auth.signInWithEmailAndPassword(fakeUser.email, fakeUser.password);
  })

  afterAll(async () => {
    let uid = getUid();
    await appService.ds.deleteRegimensOfUser(uid);
    await appService.ds.deleteComplianceReportsOfUser(uid);
    await appService.auth.signOut();
  })

  function getUid() {
    return appService.auth.currentUser.uid
  }
  function createAndGetRegimenObjFromDS() {
    let myFakeRegimenObj = _.cloneDeep(fakeRegimenObject);
    myFakeRegimenObj.uid = getUid();

    appService.ds.upsertRegimen(myFakeRegimenObj);
    return myFakeRegimenObj;
  }

  it('Get user id', () => {
    let uid = appState._getUid();
  })

  it('Get user profile', async () => {
    let profile = await appState.getUserProfile();
    expect(profile.email).toEqual(fakeUser.email);
    expect(profile.role).toEqual(UserRoles.patient);
  })

  it('Get compliance reports for a date of a regimen', async () => {
    let regimenObj = createAndGetRegimenObjFromDS();
    let regimenId = regimenObj.id;
    let dateOfSecondRegimenPhase = moment(regimenObj.startDate).add(8, 'days');
    let dateStr = dateOfSecondRegimenPhase.format(DateFormatISO8601);

    let reports = await appState.getOrInitComplianceReportsForDate(dateStr);

    expect(reports).toHaveLength(2);
    expect(reports[0].regimenId).toEqual(regimenObj.id);
    expect(reports[0].regimenPhase).toEqual(regimenObj.regimenPhases[1].phase);
    expect(reports[0].treatmentId).toEqual(regimenObj.regimenPhases[1].treatments[0].id);
    expect(reports[0].date).toEqual(dateStr);
    expect(reports[0].lastUpdatedAtTimestamp).toEqual(UNDEFINED_TIMESTAMP);
    expect(reports[0].status).toBe(ComplianceStatusOptions.undefined);

    expect(reports[1].treatmentId).toEqual(regimenObj.regimenPhases[1].treatments[1].id);
    expect(reports[1].status).toBe(ComplianceStatusOptions.undefined);

  })
  
  it('Initialize', async () => {
    let regimenObj = createAndGetRegimenObjFromDS();
    await appState.initialize(regimenObj.startDate);
    expect(appState.latestRegimen.toObj()).toMatchObject(regimenObj);
  })
})