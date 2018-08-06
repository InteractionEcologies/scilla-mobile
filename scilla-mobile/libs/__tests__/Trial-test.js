import 'react-native';
import React from 'react';
import { TrialMaker } from "../Trial";
import { 
  TrialTypes, 
  VarTypes,
  StatusOptions,
  TrialConfigKeys,
} from "../intecojs/types";
import moment from "moment";
import { DateFormatISO8601 } from "../intecojs/utils";

describe("TrialMaker", () => {
  let uid = "12345"

  beforeEach( () => {
    let trialMaker;
  });

  afterEach( () => {

  });

  it('init', () => {
    trialMaker = new TrialMaker();
    expect(trialMaker._data.tid).not.toEqual("");
    expect(trialMaker._data.uid).toEqual("");
    expect(trialMaker._data.type).toEqual(TrialTypes.none);
    expect(trialMaker._data.startDate).toEqual(moment().format(DateFormatISO8601));
    // expect(trialMaker._data.)
  });

  it('init from data', () => {

  });

  it('set user id', () => {
    trialMaker = new TrialMaker();
    trialMaker.setUserId(uid);
    expect(trialMaker._data.uid).toEqual(uid);
  });

  it('set trial type', () => {
    trialMaker = new TrialMaker();
    trialMaker.setTrialType(TrialTypes.incBaclofen);
    expect(trialMaker._data.type).toEqual(TrialTypes.incBaclofen);
  });

  it('set trial config', () => {
    trialMaker = new TrialMaker();
    trialMaker.setTrialType(TrialTypes.incBaclofen)
      .setTrialConfig({
        currentDoseMg: 0 
      });
    })

  it('set tracked variables', () => {
    trialMaker = new TrialMaker();
    trialMaker.setTrialType(TrialTypes.incBaclofen)
      .removeTrackedVar(VarTypes.sleepQuality);
    expect(trialMaker._data.trackedVars).toHaveLength(3);
    expect(trialMaker._data.trackedVars).not.toContain(VarTypes.sleepQuality);
    
    trialMaker.addTrackedVar(VarTypes.sleepQuality);
    expect(trialMaker._data.trackedVars).toContain(VarTypes.sleepQuality);
  });

  it('generate treatment periods', () => {
    trialMaker = new TrialMaker();
    trialMaker
      .setUserId(uid)
      .setTrialType(TrialTypes.incBaclofen)
      .setTrialConfig({
        currentDoseMg: 0
      })
      .setTrialName("Try out Baclofen")
      .confirmTrialConfig()
      .setStartDate(moment().format(DateFormatISO8601))
      .confirmTrialDate()
      .make()

    expect(trialMaker._data.treatmentPeriods).toHaveLength(6);
  });

  // it('set reminders', () => {

  // });

  // it('pause treatment', () => {

  // });

  // it('stop treatment', () => {

  // });

})