// @flow
import 'react-native';
import React from 'react';
import { Regimen, RegimenFactory } from "../regimen";
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

  beforeEach( () => {
    let regimen: Regimen;
  });

  afterEach( () => {

  });

  it('init', () => {
    regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    expect(regimen._obj.id).not.toEqual("");
    expect(regimen._obj.uid).toEqual("");
    expect(regimen._obj.type).toEqual(RegimenTypes.incBaclofen);
    expect(regimen._obj.startDate).toEqual(moment().format(DateFormatISO8601));
    // expect(regimen._obj.)
  });

  it('init from data', () => {

  });

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
    regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
    regimen
      .setRegimenParam({
        currentDoseMg: 0
      })
      .confirmRegimenParam();

    regimen.removeTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimen._obj.trackedMeasurementTypes).toHaveLength(3);
    expect(regimen._obj.trackedMeasurementTypes).not.toContain(MeasurementTypes.sleepQuality);
    
    regimen.addTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimen._obj.trackedMeasurementTypes).toContain(MeasurementTypes.sleepQuality);
  });

  it('generate regimen periods', () => {
    regimen = new RegimenFactory.createRegimen(RegimenTypes.incBaclofen);
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

    expect(regimen._obj.regimenPhases).toHaveLength(6);
  });

  // it('set reminders', () => {

  // });

  // it('pause regimen', () => {

  // });

  // it('stop regimen', () => {

  // });

})