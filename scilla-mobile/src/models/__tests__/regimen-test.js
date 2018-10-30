// @flow
import 'react-native';
import React from 'react';
import { 
  Regimen, 
  RegimenFactory, 
  BaclofenRegimenPhase,
  BaclofenRegimenPhaseDef
} from "../regimen";
import { 
  RegimenTypes, 
  MeasurementTypes,
  RegimenStatusOptions,
  RegimenParamKeys,
  DateFormatISO8601,
  RegimenGoalOptions,
  IDataSource,
} from "../../libs/intecojs";
import type {
  RegimenType
} from "../../libs/intecojs";
import { fakeRegimenObject } from "../../datafixtures/fakeRegimen";

import * as firebase from "firebase";

import moment from "moment";
import _ from "lodash";

import AppService from "../../app/AppService";
const appService = new AppService();

describe("regimen", () => {
  let uid = "12345"

  function makeBaclofenRegimen(regimenType: RegimenType, currentDoseMg: number = 0): Regimen {
    if(!_.includes(
      [RegimenTypes.incBaclofen, RegimenTypes.decBaclofen],
      regimenType
    )) {
        throw TypeError(`Does not support this type ${regimenType}`);
    }

    let regimen = new RegimenFactory.createRegimen(regimenType);
    regimen.setUserId(uid);
    
    if(regimenType === RegimenTypes.incBaclofen) {
      regimen.setRegimenParam({currentDoseMg: currentDoseMg});
    } else if ( regimenType === RegimenTypes.decBaclofen) {
      regimen.setRegimenParam({currentDoseMg: currentDoseMg});
    }
    regimen.setRegimenName("Baclofen");
    regimen.generateRegimenGoal();
    regimen.setStartDate(moment().format(DateFormatISO8601));
    regimen.confirmRegimenDate();
    regimen.make();
    return regimen;
  }

  // Stub the persistent setting on Firebase
  beforeAll( () => {

  });

  beforeEach( () => {
    
  });

  afterEach( () => {

  });

  it('init', () => {
    let regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    expect(regimen._obj.id).not.toEqual("");
    expect(regimen._obj.uid).toEqual("");
    expect(regimen._obj.type).toEqual(RegimenTypes.incBaclofen);
    expect(regimen._obj.startDate).toEqual(moment().format(DateFormatISO8601));
  });

  it('set user id', async () => {
    let regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    regimen.setUserId(uid);
    expect(regimen._obj.uid).toEqual(uid);
  });

  it('init decBalcofen regimen type', async () => {
    let regimen = new RegimenFactory.createRegimen(RegimenTypes.decBaclofen);
    expect(regimen._obj.type).toEqual(RegimenTypes.decBaclofen);
  });

  it('set regimen param', async () => {
    let regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    regimen.setRegimenParam({currentDoseMg: 0 });
    expect(regimen._obj.regimenParam.currentDoseMg).toEqual(0);
  })

  it('add and remove tracked variables', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.incBaclofen);

    regimen.removeTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimen._obj.trackedMeasurementTypes).toHaveLength(3);
    expect(regimen._obj.trackedMeasurementTypes).not.toContain(MeasurementTypes.sleepQuality);
    
    regimen.addTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimen._obj.trackedMeasurementTypes).toContain(MeasurementTypes.sleepQuality);
  });

  it('Make an IncBaclofenRegimen with 0mg current dosage', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.incBaclofen);
    expect(regimen.regimenGoal).toEqual(RegimenGoalOptions.baclofen30mg);
    expect(regimen.getRegimenPhases()).toHaveLength(6);
    expect(regimen.getRegimenPhaseObjs()).toHaveLength(6);
  });

  it('Make an IncBaclofenRegimen with 10mg current dosage', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.incBaclofen, 10);
    expect(regimen.regimenGoal).toEqual(RegimenGoalOptions.baclofen30mg);
    expect(regimen.getRegimenPhases()).toHaveLength(4);
    expect(regimen.getRegimenPhaseObjs()).toHaveLength(4);
  });

  it('Make an IncBaclofenRegimen with 26mg current dosage', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.incBaclofen, 26);
    expect(regimen.regimenGoal).toEqual(RegimenGoalOptions.baclofen60mg);
    expect(regimen.getRegimenPhases()).toHaveLength(6);
    expect(regimen.getRegimenPhaseObjs()).toHaveLength(6);
  });

  it('Make an IncBaclofenRegimen with 30mg current dosage', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.incBaclofen, 30);
    expect(regimen.regimenGoal).toEqual(RegimenGoalOptions.baclofen60mg);
    expect(regimen.getRegimenPhases()).toHaveLength(6);
    expect(regimen.getRegimenPhaseObjs()).toHaveLength(6);
  });

  it('Make an IncBaclofenRegimen with 50mg current dosage', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.incBaclofen, 50);
    expect(regimen.regimenGoal).toEqual(RegimenGoalOptions.baclofen60mg);
    expect(regimen.getRegimenPhases()).toHaveLength(2);
    expect(regimen.getRegimenPhaseObjs()).toHaveLength(2);
  });

  it('Make an DecBaclofen with 50mg current dosage', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.decBaclofen, 50);
    expect(regimen.regimenGoal).toEqual(RegimenGoalOptions.baclofen30mg);
    
    let regimenPhases = regimen.getRegimenPhases();
    expect(regimenPhases).toHaveLength(4);

    for(let i=0; i < 4; i++) {
      expect(regimenPhases[i].phase).toEqual(i);
    }

    expect(regimenPhases[0].treatmentObjects).toMatchObject(
      BaclofenRegimenPhaseDef['45mg']
    );
    
  });

  it('export regimen to object', async () => {
    let regimen = makeBaclofenRegimen(RegimenTypes.incBaclofen, 0);
    let regimenObj = regimen.toObj();

    expect(regimenObj.uid).toEqual(uid);
    expect(regimenObj.trackedMeasurementTypes).toEqual(
      [
        MeasurementTypes.sleepQuality, 
        MeasurementTypes.spasticitySeverity,
        MeasurementTypes.baclofenAmount,
        MeasurementTypes.tiredness
      ]
    );
    expect(regimenObj.regimenPhases).toHaveLength(6);
  });

  it('create a baclofen regimen phase', async () => {
    let now = moment();
    let regimenPhase = new BaclofenRegimenPhase(0, now, 5)
    
    expect(regimenPhase.phase).toEqual(0);
    expect(regimenPhase.startDate).toEqual(now.format(DateFormatISO8601));
    
    expect(regimenPhase.endDate)
      .toEqual(now.add(6, 'days').format(DateFormatISO8601))
    
    // expect(regimenPhase.treatmentObjects)
    //   .toEqual(BaclofenRegimenPhaseDef['5mg']);
    expect(regimenPhase.treatmentObjects)
      .toMatchObject(BaclofenRegimenPhaseDef['5mg'])
  });

  it('create a baclofen regimen from object', async () => {
    let regimen = RegimenFactory.createRegimenFromObj(fakeRegimenObject);
    expect(regimen.regimenPhases[0].toObj())
      .toMatchObject(fakeRegimenObject.regimenPhases[0])
  });

  // it('save a regimen to Datastore', () => {
  //   let regimen = RegimenFactory.createRegimenFromObj(fakeRegimenObject);
  //   appService.ds.createRegimen(regimen.toObj());

  //   appService.ds.deleteRegimen(regimen.id);
  // })

  // it('get and delete the latest regimen', () => {

  //   appService.ds.createRegimen(fakeRegimenObject)
  //   let uid = fakeRegimenObject.uid;
  //   appService.ds.getLatestRegimen(uid)
  //     .then( (regimen) => {
  //       expect(regimen.uid).toEqual(uid)
  //       expect(regimen.startDate).toEqual(fakeRegimenObject.startDate)
  //     })
  //   appService.ds.deleteRegimen(fakeRegimenObject.id)
  // });

})