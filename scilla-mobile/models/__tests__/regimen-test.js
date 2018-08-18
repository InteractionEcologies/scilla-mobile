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
  DateFormatISO8601
} from "../../libs/intecojs";
import moment from "moment";

describe("regimen", () => {
  let uid = "12345"
  let regimen: Regimen;

  function makeRegimen(): Regimen {
    let regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    regimen
      .setUserId(uid)
      .setRegimenParam({
        currentDoseMg: 0
      })
      .setRegimenName("Try out Baclofen")
      .confirmRegimenParam()
      .setStartDate(moment().format(DateFormatISO8601))
      .confirmRegimenDate()
      .make()
    return regimen

  }

  beforeEach( () => {
    
  });

  afterEach( () => {

  });

  it('init', () => {
    regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    expect(regimen._obj.id).not.toEqual("");
    expect(regimen._obj.uid).toEqual("");
    expect(regimen._obj.type).toEqual(RegimenTypes.incBaclofen);
    expect(regimen._obj.startDate).toEqual(moment().format(DateFormatISO8601));
  });

  // it('init from data', () => {

  // });

  it('set user id', () => {
    regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    regimen.setUserId(uid);
    expect(regimen._obj.uid).toEqual(uid);
  });

  it('set regimen type', () => {
    regimen = new RegimenFactory.createRegimen(RegimenTypes.decBaclofen);
    expect(regimen._obj.type).toEqual(RegimenTypes.decBaclofen);
  });

  it('set regimen param', () => {
    regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    regimen
      .setRegimenParam({
        currentDoseMg: 0 
    });
  })

  it('set tracked variables', () => {
    regimen = makeRegimen();

    regimen.removeTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimen._obj.trackedMeasurementTypes).toHaveLength(3);
    expect(regimen._obj.trackedMeasurementTypes).not.toContain(MeasurementTypes.sleepQuality);
    
    regimen.addTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimen._obj.trackedMeasurementTypes).toContain(MeasurementTypes.sleepQuality);
  });

  it('generate regimen periods', () => {
    regimen = makeRegimen();
    expect(regimen.getRegimenPhases()).toHaveLength(6);
    expect(regimen.getRegimenPhaseObjs()).toHaveLength(6);
  });

  it('export regimen to object', () => {
    regimen = makeRegimen();
    let regimenObj = regimen.toObj();
    expect(regimenObj.uid).toEqual(uid);
    expect(regimenObj.trackedMeasurementTypes).toEqual(
      [
        MeasurementTypes.sleepQuality, 
        MeasurementTypes.spasticitySeverity,
        MeasurementTypes.baclofenAmount,
        MeasurementTypes.tiredness
      ]
    ),
    expect(regimenObj.regimenPhases).toHaveLength(6);
  });

  it('create a baclofen regimen phase', () => {
    let now = moment();
    let regimenPhase = new BaclofenRegimenPhase(0, now, 5)
    
    expect(regimenPhase.phase).toEqual(0);
    expect(regimenPhase.startDate).toEqual(now.format(DateFormatISO8601));
    
    expect(regimenPhase.endDate)
      .toEqual(now.add(7, 'days').format(DateFormatISO8601))
    
    expect(regimenPhase.treatmentObjects)
      .toEqual(BaclofenRegimenPhaseDef['5mg']);
  });

  // it('pause regimen', () => {

  // });

  // it('stop regimen', () => {

  // });

})