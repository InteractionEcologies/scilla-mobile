// @flow
import type { 
  RegimenObject,
  RegimenParamObject,
  RegimenGoalOption,
  MeasurementType,
} from "../../libs/intecojs";

import {
  RegimenType,
  UserId,
  RegimenTypes,
  generatePushIDFunc,
  NotImplementedError,
  MeasurementTypes,
  ReminderConfigObject,
  DateFormatISO8601,
  RegimenPhaseObject,
  RegimenStatusOptions,
} from "../../libs/intecojs";

import { IRegimenPhase } from "./";

import moment from "moment";
import _ from "lodash";

interface IRegimenCore {
  +type: RegimenType;
  +regimenGoal: RegimenGoalOption;

  generatePushID(): string;
  
  updateFromObj(obj: RegimenObject): void;
  
  setUserId(uid: UserId): Regimen;
  setRegimenName(name: string): Regimen;
  
  confirmRegimenParam(): Regimen;
  
  addTrackedMeasurementType(mtype: MeasurementType): Regimen;
  removeTrackedMeasurementType(mtype: MeasurementType): Regimen;
  getTrackedMeasurementTypes(): MeasurementType[];
  
  setStartDate(date: string): Regimen;
  confirmRegimenDate(): Regimen;
  
  setReminderConfig(reminderId: string, newConfig: ReminderConfigObject): Regimen;
  setReminderTime(reminderId: string, time: string): Regimen;
  
  make(): RegimenObject;
  getRegimenPhases(): RegimenPhaseObject[];

  toObj(): RegimenObject;
}

interface IRegimenCustom {
  setRegimenParam(param: RegimenParamObject): Regimen;
  _personalizeRegimenGoal(param: RegimenParamObject): RegimenGoalOption;
  _personalizeRegimenDurationDays(param: RegimenParamObject): number;
  _generateDefaultTrackedMeasurementTypes(): MeasurementType[];
  _generateDefaultReminderConfigs(): ReminderConfigObject[];
  _generateRegimenPhases(
    goal: RegimenGoalOption, 
    param: RegimenParamObject, 
    startDate: string
  ): IRegimenPhase[]
}

export class Regimen implements IRegimenCore, IRegimenCustom {
  _obj: RegimenObject;
  generatePushID: () => string;
  regimenDurationDays: number;

  regimenPhases: IRegimenPhase[];
  
  constructor() {
    this.generatePushID = generatePushIDFunc();
    this._obj = this._createDefaultRegimenObj();
  }

  _createDefaultRegimenObj(): RegimenObject {
    return {
      id: this.generatePushID(), 
      uid: "", 
      name: "My New Regimen", 
      startDate: moment().format(DateFormatISO8601),
      endDate: moment().add(7, 'days').format(DateFormatISO8601),
      type: RegimenTypes.undefined,
      regimenParam: {},
      regimenGoal: null,
      trackedMeasurementTypes: [], 
      status: RegimenStatusOptions.active, 
      regimenPhases: [], 
      reminderConfigs: []
    }
  }

  updateFromObj(obj: RegimenObject) {
    // Doesn't allow others to change its type
    var clonedObj = Object.assign({}, obj);
    clonedObj.type = this._obj.type;
    this._obj = clonedObj;
  }

  setUserId(uid: UserId): Regimen {
    this._obj.uid = uid;
    return this;
  }

  setRegimenName(name: string): Regimen {
    this._obj.name = name;
    return this;
  }

  get type() { return this._obj.type }
  get regimenGoal() { return this._obj.regimenGoal }

  setRegimenParam(param: RegimenParamObject): Regimen {
    throw new NotImplementedError();
  }

  confirmRegimenParam(): Regimen {
    this._obj.regimenGoal = this._personalizeRegimenGoal(this._obj.regimenParam);
    this.regimenDurationDays = this._personalizeRegimenDurationDays(this._obj.regimenParam);
    this._obj.trackedMeasurementTypes = this._generateDefaultTrackedMeasurementTypes();
    return this;
  }

  _personalizeRegimenGoal(param: RegimenParamObject): RegimenGoalOption {
    throw new NotImplementedError();
  }

  _personalizeRegimenDurationDays(param: RegimenParamObject): number {
    throw new NotImplementedError();
  }

  _generateDefaultTrackedMeasurementTypes(): MeasurementType[] {
    let trackedMeasurementTypes = [
      MeasurementTypes.sleepQuality, 
      MeasurementTypes.spasticitySeverity,
      MeasurementTypes.baclofenAmount,
      MeasurementTypes.tiredness
    ];
    return trackedMeasurementTypes;
  }

  addTrackedMeasurementType(mtype: MeasurementType): Regimen {
    this._obj.trackedMeasurementTypes = _.union(
      this._obj.trackedMeasurementTypes, [mtype]);
    return this;
  }

  removeTrackedMeasurementType(mtype: MeasurementType): Regimen {
    this._obj.trackedMeasurementTypes = _.pull(this._obj.trackedMeasurementTypes, mtype);
    return this;
  }

  getTrackedMeasurementTypes(): MeasurementType[] {
    // clone the trackedMeasurementTypes array intead of returning the ref.
    return Array.from(this._obj.trackedMeasurementTypes);
  }

  setStartDate(date: string): Regimen {
    this._obj.endDate = moment(date)
      .add(this.regimenDurationDays, 'days')
      .format(DateFormatISO8601);
    return this;
  }

  confirmRegimenDate(): Regimen {
    this._obj.reminderConfigs = this._generateDefaultReminderConfigs();
    return this;
  }
  
  _generateDefaultReminderConfigs(): ReminderConfigObject[] {
    return [];
  }

  setReminderConfig(reminderId: string, newConfig: ReminderConfigObject): Regimen {
    this._obj.reminderConfigs = this._obj.reminderConfigs.map( (oldConfig) => {
      if(oldConfig.id === reminderId) {
        return newConfig;
      } 
      return oldConfig;
    })
    return this;
  }

  setReminderTime(reminderId: string, time: string): Regimen {
    this._obj.reminderConfigs = this._obj.reminderConfigs.map( 
      (oldConfig: ReminderConfigObject): ReminderConfigObject => {
        if(oldConfig.id === reminderId) {
          oldConfig.time = time;
          return oldConfig;
        } 
        return oldConfig;
      }
    )
    return this;
  }

  make() {
    this.regimenPhases = this._generateRegimenPhases(
      this._obj.regimenGoal, 
      this._obj.regimenParam,
      this._obj.startDate
    )
    let objects = this.regimenPhases.map( (rp) => { return rp.toObj() });
    this._obj.regimenPhases = objects;
  }

  _generateRegimenPhases(
    goal: RegimenGoalOption, 
    param: RegimenParamObject, 
    startDate: string
  ): RegimenPhaseObject[] {
    throw new NotImplementedError();
  }

  getRegimenPhases(): IRegimenPhase[] {
    return _.clone(this.regimenPhases);
  }

  getRegimenPhaseObjs(): RegimenPhaseObject[] {
    let objects = this.regimenPhases.map( (rp) => { return rp.toObj() });
    return objects;
  }

  toObj(): RegimenObject {
    this._obj.regimenPhases = this.getRegimenPhaseObjs();
    return Object.assign({}, this._obj);
  }
}

