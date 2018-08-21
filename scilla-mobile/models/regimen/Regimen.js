// @flow
import type { 
  UserId,
  RegimenObject,
  RegimenParamObject,
  RegimenGoalOption,
  MeasurementType,
  RegimenType,
  ReminderConfigObject,
  RegimenPhaseObject,
} from "../../libs/intecojs";

import {
  RegimenGoalOptions,
  RegimenTypes,
  generatePushIDFunc,
  NotImplementedError,
  MeasurementTypes,
  DateFormatISO8601,
  RegimenStatusOptions,
} from "../../libs/intecojs";

import { IRegimenPhase } from "./";

import moment from "moment";
import _ from "lodash";

interface IRegimenCore {
  +id: string;
  +type: RegimenType;
  +regimenGoal: RegimenGoalOption;
  +startDate: string;
  +endDate: string;

  generatePushID(): string;
  
  setUserId(uid: UserId): Regimen;
  setRegimenName(name: string): Regimen;
  
  generateRegimenGoal(): Regimen;
  
  addTrackedMeasurementType(mtype: MeasurementType): Regimen;
  removeTrackedMeasurementType(mtype: MeasurementType): Regimen;
  getTrackedMeasurementTypes(): MeasurementType[];
  
  setStartDate(date: string): Regimen;
  confirmRegimenDate(): Regimen;
  
  setReminderConfig(reminderId: string, newConfig: ReminderConfigObject): Regimen;
  setReminderTime(reminderId: string, time: string): Regimen;

  getRegimenPhaseByDate(date: string): IRegimenPhase | null;
  getRegimenPhaseObjByDate(date: string): RegimenPhaseObject | null;
  
  make(): void;
  getRegimenPhases(): IRegimenPhase[];
  getRegimenPhaseObjs(): RegimenPhaseObject[];

  toObj(): RegimenObject;
}

interface IRegimenCustom {
  updateFromObj(obj: RegimenObject): void;
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


  get id() { return this._obj.id }
  get type() { return this._obj.type }
  get regimenGoal() { return this._obj.regimenGoal }
  get startDate() { return this._obj.startDate }
  get endDate() { return this._obj.endDate }
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
      regimenGoal: RegimenGoalOptions.undefined,
      trackedMeasurementTypes: [], 
      status: RegimenStatusOptions.active, 
      regimenPhases: [], 
      reminderConfigs: []
    }
  }

  updateFromObj(obj: RegimenObject) {
    throw new NotImplementedError();
  }

  setUserId(uid: UserId): Regimen {
    this._obj.uid = uid;
    return this;
  }

  setRegimenName(name: string): Regimen {
    this._obj.name = name;
    return this;
  }

  setRegimenParam(param: RegimenParamObject): Regimen {
    throw new NotImplementedError();
  }

  generateRegimenGoal(): Regimen {
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
    this._obj.reminderConfigs = _.map(this._obj.reminderConfigs, (oldConfig) => {
      if(oldConfig.id === reminderId) {
        return newConfig;
      } 
      return oldConfig;
    })
    return this;
  }

  setReminderTime(reminderId: string, time: string): Regimen {
    this._obj.reminderConfigs = _.map(this._obj.reminderConfigs,
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
    );
    let objects = this.getRegimenPhaseObjs();
    this._obj.regimenPhases = objects;
  }

  _generateRegimenPhases(
    goal: RegimenGoalOption, 
    param: RegimenParamObject, 
    startDate: string
  ): IRegimenPhase[] {
    throw new NotImplementedError();
  }

  getRegimenPhases(): IRegimenPhase[] {
    return _.clone(this.regimenPhases);
  }

  getRegimenPhaseObjs(): RegimenPhaseObject[] {
    let objects = this.regimenPhases 
                  ? _.map(this.regimenPhases, (rp) => { return rp.toObj() })
                  : [];
    return objects;
  }

  getRegimenPhaseByDate(date: string): IRegimenPhase | null {
    let filteredRegimenPhases = _.filter(this.regimenPhases, (rp) => {
      // check if `date` is within startDate and endDate
      let startDate= moment(rp.startDate);
      let endDate = moment(rp.endDate);
      let dateMoment = moment(date);
      return dateMoment.isSameOrAfter(startDate) && dateMoment.isSameOrBefore(endDate);
    });

    // should only get one or zero
    if(filteredRegimenPhases.length === 0) {
      return null
    } else {
      return filteredRegimenPhases[0]
    } 
  }
  getRegimenPhaseObjByDate(date: string): RegimenPhaseObject | null {
    let regimenPhase = this.getRegimenPhaseByDate(date);
    if(regimenPhase) {
      return regimenPhase.toObj();
    } else {
      return null;
    }
  }

  toObj(): RegimenObject {
    this._obj.regimenPhases = this.getRegimenPhaseObjs();
    return Object.assign({}, this._obj);
  }
}

