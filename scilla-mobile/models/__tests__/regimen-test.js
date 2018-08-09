// @flow
import 'react-native';
import React from 'react';
import { RegimenMaker, RegimenMakerFactory } from "../regimen";
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
    let regimenMaker: RegimenMaker;
  });

  afterEach( () => {

  });

  it('init', () => {
    regimenMaker = new RegimenMakerFactory.createRegimenMaker(RegimenTypes.incBaclofen);
    expect(regimenMaker._obj.id).not.toEqual("");
    expect(regimenMaker._obj.uid).toEqual("");
    expect(regimenMaker._obj.type).toEqual(RegimenTypes.incBaclofen);
    expect(regimenMaker._obj.startDate).toEqual(moment().format(DateFormatISO8601));
    // expect(regimenMaker._obj.)
  });

  it('init from data', () => {

  });

  it('set user id', () => {
    regimenMaker = new RegimenMakerFactory.createRegimenMaker(RegimenTypes.incBaclofen);
    regimenMaker.setUserId(uid);
    expect(regimenMaker._obj.uid).toEqual(uid);
  });

  it('set regimen type', () => {
    regimenMaker = new RegimenMakerFactory.createRegimenMaker(RegimenTypes.decBaclofen);
    expect(regimenMaker._obj.type).toEqual(RegimenTypes.decBaclofen);
  });

  it('set regimen param', () => {
    regimenMaker = new RegimenMakerFactory.createRegimenMaker(RegimenTypes.incBaclofen);
    regimenMaker
      .setRegimenParam({
        currentDoseMg: 0 
      });
    })

  it('set tracked variables', () => {
    regimenMaker = new RegimenMakerFactory.createRegimenMaker(RegimenTypes.incBaclofen);
    regimenMaker
      .setRegimenParam({
        currentDoseMg: 0
      })
      .confirmRegimenParam();

    regimenMaker.removeTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimenMaker._obj.trackedMeasurementTypes).toHaveLength(3);
    expect(regimenMaker._obj.trackedMeasurementTypes).not.toContain(MeasurementTypes.sleepQuality);
    
    regimenMaker.addTrackedMeasurementType(MeasurementTypes.sleepQuality);
    expect(regimenMaker._obj.trackedMeasurementTypes).toContain(MeasurementTypes.sleepQuality);
  });

  it('generate regimen periods', () => {
    regimenMaker = new RegimenMakerFactory.createRegimenMaker(RegimenTypes.incBaclofen);
    regimenMaker
      .setUserId(uid)
      .setRegimenParam({
        currentDoseMg: 0
      })
      .setRegimenName("Try out Baclofen")
      .confirmRegimenParam()
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