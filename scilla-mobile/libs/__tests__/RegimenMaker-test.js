import 'react-native';
import React from 'react';
import { RegimenMaker } from "../RegimenMaker";
import { 
  RegimenTypes, 
  MeasurementTypes,
  RegimenStatusOptions,
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
    expect(regimenMaker._obj.id).not.toEqual("");
    expect(regimenMaker._obj.uid).toEqual("");
    expect(regimenMaker._obj.type).toEqual(RegimenTypes.undefined);
    expect(regimenMaker._obj.startDate).toEqual(moment().format(DateFormatISO8601));
    // expect(regimenMaker._obj.)
  });

  it('init from data', () => {

  });

  it('set user id', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setUserId(uid);
    expect(regimenMaker._obj.uid).toEqual(uid);
  });

  it('set regimen type', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setRegimenType(RegimenTypes.incBaclofen);
    expect(regimenMaker._obj.type).toEqual(RegimenTypes.incBaclofen);
  });

  it('set regimen config', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setRegimenType(RegimenTypes.incBaclofen)
      .setRegimenConfig({
        currentDoseMg: 0 
      });
    })

  it('set tracked variables', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker.setRegimenType(RegimenTypes.incBaclofen)
      .removeTrackedVar(MeasurementTypes.sleepQuality);
    expect(regimenMaker._obj.trackedMeasurementTypes).toHaveLength(3);
    expect(regimenMaker._obj.trackedMeasurementTypes).not.toContain(MeasurementTypes.sleepQuality);
    
    regimenMaker.addTrackedVar(MeasurementTypes.sleepQuality);
    expect(regimenMaker._obj.trackedMeasurementTypes).toContain(MeasurementTypes.sleepQuality);
  });

  it('generate regimen periods', () => {
    regimenMaker = new RegimenMaker();
    regimenMaker
      .setUserId(uid)
      .setRegimenType(RegimenTypes.incBaclofen)
      .setRegimenConfig({
        currentDoseMg: 0
      })
      .setRegimenName("Try out Baclofen")
      .confirmRegimenConfig()
      .setStartDate(moment().format(DateFormatISO8601))
      .confirmRegimenDate()
      .make()

    expect(regimenMaker._obj.regimenPhases).toHaveLength(6);
  });

  // it('set reminders', () => {

  // });

  // it('pause regimen', () => {

  // });

  // it('stop regimen', () => {

  // });

})