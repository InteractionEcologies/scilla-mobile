import 'react-native';
import React from 'react';
import { TrialHelper } from "../Trial";
import { 
  TrialTypes, 
  VarTypes,
  StatusOptions,
  TrialConfigKeys,
} from "../intecojs/types";
import moment from "moment";
import { DateFormatISO8601 } from "../intecojs/utils";

describe("TrialHelper", () => {
  let uid = "12345"

  beforeEach( () => {
    let trialHelper;
  });

  afterEach( () => {

  });

  it('init', () => {
    trialHelper = new TrialHelper();
    expect(trialHelper._data.tid).not.toEqual("");
    expect(trialHelper._data.uid).toEqual("");
    expect(trialHelper._data.type).toEqual(TrialTypes.none);
    expect(trialHelper._data.startDate).toEqual(moment().format(DateFormatISO8601));
    // expect(trialHelper._data.)
  });

  it('init from data', () => {

  });

  it('set user id', () => {
    trialHelper = new TrialHelper();
    trialHelper.setUserId(uid);
    expect(trialHelper._data.uid).toEqual(uid);
  });

  it('set trial type', () => {
    trialHelper = new TrialHelper();
    trialHelper.setTrialType(TrialTypes.incBaclofen);
    expect(trialHelper._data.type).toEqual(TrialTypes.incBaclofen);
  });

  it('set trial config', () => {
    trialHelper = new TrialHelper();
    trialHelper.setTrialType(TrialTypes.incBaclofen)
      .setTrialConfig({
        currentDoseMg: 0 
      });
    })

  it('set tracked variables', () => {
    trialHelper = new TrialHelper();
    trialHelper.setTrialType(TrialTypes.incBaclofen)
      .removeTrackedVar(VarTypes.sleepQuality);
    expect(trialHelper._data.trackedVars).toHaveLength(3);
    expect(trialHelper._data.trackedVars).not.toContain(VarTypes.sleepQuality);
    
    trialHelper.addTrackedVar(VarTypes.sleepQuality);
    expect(trialHelper._data.trackedVars).toContain(VarTypes.sleepQuality);
  });

  it('generate treatment periods', () => {
    trialHelper = new TrialHelper();
    trialHelper
      .setUserId(uid)
      .setTrialType(TrialTypes.incBaclofen)
      .setTrialConfig({
        currentDoseMg: 0
      })
      .setTrialName("Try out Baclofen")
      .generateTrialGoal()
      .setStartDate(moment().format(DateFormatISO8601))
      .make()

    expect(trialHelper._data.treatmentPeriods).toHaveLength(6);
  });

  // it('set reminders', () => {

  // });

  // it('pause treatment', () => {

  // });

  // it('stop treatment', () => {

  // });

})