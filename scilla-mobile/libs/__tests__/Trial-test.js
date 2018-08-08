import 'react-native';
import React from 'react';
import { RegimenMaker } from "../Regimen";
import { 
  RegimenOptions, 
  MeasurementTypes,
  StatusOptions,
  RegimenParamKeys,
} from "../intecojs/types";
import moment from "moment";
import { DateFormatISO8601 } from "../intecojs/utils";

describe("RegimenMaker", () => {
  let uid = "12345"

  beforeEach( () => {
    let regimenMaker;
  });

  afterEach( () => {

  });

  it('init', () => {
    regimenMaker = new RegimenMaker();
    expect(regimenMaker._data.tid).not.toEqual("");
    expect(regimenMaker._data.uid).toEqual("");
    expect(regimenMaker._data.type).toEqual(RegimenOptions.none);
    expect(regimenMaker._data.startDate).toEqual(moment().format(DateFormatISO8601));
    // expect(regimenMaker._data.)
  });

  it('init from data', () => {

  });

  it('set user id', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setUserId(uid);
    expect(regimenMaker._data.uid).toEqual(uid);
  });

  it('set regimen type', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setRegimenType(RegimenOptions.incBaclofen);
    expect(regimenMaker._data.type).toEqual(RegimenOptions.incBaclofen);
  });

  it('set regimen config', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setRegimenType(RegimenOptions.incBaclofen)
      .setRegimenConfig({
        currentDoseMg: 0 
      });
    })

  it('set tracked variables', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setRegimenType(RegimenOptions.incBaclofen)
      .removeTrackedVar(MeasurementTypes.sleepQuality);
    expect(regimenMaker._data.trackedVars).toHaveLength(3);
    expect(regimenMaker._data.trackedVars).not.toContain(MeasurementTypes.sleepQuality);
    
    regimenMaker.addTrackedVar(MeasurementTypes.sleepQuality);
    expect(regimenMaker._data.trackedVars).toContain(MeasurementTypes.sleepQuality);
  });

  it('generate treatment periods', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker
      .setUserId(uid)
      .setRegimenType(RegimenOptions.incBaclofen)
      .setRegimenConfig({
        currentDoseMg: 0
      })
      .setRegimenName("Try out Baclofen")
      .confirmRegimenConfig()
      .setStartDate(moment().format(DateFormatISO8601))
      .confirmRegimenDate()
      .make()

    expect(regimenMaker._data.treatmentPeriods).toHaveLength(6);
  });

  // it('set reminders', () => {

  // });

  // it('pause treatment', () => {

  // });

  // it('stop treatment', () => {

  // });

})