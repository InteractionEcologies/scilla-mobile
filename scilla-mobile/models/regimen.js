// @flow
import type { 
  RegimenObject,
  RegimenParamObject,
  RegimenGoalOption,
  MeasurementType
} from "../libs/intecojs";

import {
  RegimenType,
  UserId,
  RegimenTypes,
  generatePushIDFunc,
  NotImplementedError,
  RegimenGoalOptions,
  MeasurementTypes,
  ReminderConfigObject,
  DateFormatISO8601,
  RegimenParamKeys,
  RegimenPhaseObject,
  RegimenStatusOptions
} from "../libs/intecojs";
import moment from "moment";
import _ from "lodash";
import { BaclofenRegimenPhaseDef } from "./BaclofenRegimenPhaseDef";

const REGIMEN_BACLOFEN_DAYS: number =  7 * 6; // 42 days, 6 weeks

export class RegimenMakerFactory {
  static createRegimenMaker(type: RegimenType): RegimenMaker {
    switch(type) {
      case RegimenTypes.incBaclofen:
        return new IncBaclofenRegimenMaker();
      case RegimenTypes.decBaclofen:
        return new DecBaclofenRegimenMaker();
      default:
        throw TypeError("No such regimen type exists");
    }
  }

  static createRegimenMakerFromObj(obj: RegimenObject): RegimenMaker {
    let regimenMaker = RegimenMakerFactory.createRegimenMaker(obj.type);
    regimenMaker.updateFromObj(obj);
    return regimenMaker;
  }

}

export class RegimenMaker {
  _obj: RegimenObject;
  generatePushID: () => string;
  regimenDurationDays: number;
  
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

  setUserId(uid: UserId): RegimenMaker {
    this._obj.uid = uid;
    return this;
  }

  setRegimenName(name: string): RegimenMaker {
    this._obj.name = name;
    return this;
  }

  get type() {
    return this._obj.type
  }

  setRegimenParam(param: RegimenParamObject): RegimenMaker {
    throw new NotImplementedError();
  }

  confirmRegimenParam(): RegimenMaker {
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

  addTrackedMeasurementType(mtype: MeasurementType): RegimenMaker {
    this._obj.trackedMeasurementTypes = _.union(
      this._obj.trackedMeasurementTypes, [mtype]);
    return this;
  }

  removeTrackedMeasurementType(mtype: MeasurementType): RegimenMaker {
    this._obj.trackedMeasurementTypes = _.pull(this._obj.trackedMeasurementTypes, mtype);
    return this;
  }

  getTrackedMeasurementTypes(): MeasurementType[] {
    // clone the trackedMeasurementTypes array intead of returning the ref.
    return Array.from(this._obj.trackedMeasurementTypes);
  }

  setStartDate(date: string): RegimenMaker {
    this._obj.endDate = moment(date)
    .add(this.regimenDurationDays, 'days')
    .format(DateFormatISO8601);
  
  return this;

  }

  confirmRegimenDate(): RegimenMaker {
    this._obj.reminderConfigs = this._generateDefaultReminderConfigs();
    return this;
  }
  
  _generateDefaultReminderConfigs(): ReminderConfigObject[] {
    return [];
  }

  setReminderConfig(reminderId: string, newConfig: ReminderConfigObject): RegimenMaker {
    this._obj.reminderConfigs = this._obj.reminderConfigs.map( (oldConfig) => {
      if(oldConfig.id === reminderId) {
        return newConfig;
      } 
      return oldConfig;
    })
    return this;
  }

  setReminderTime(reminderId: string, time: string) {
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

  make(): RegimenObject {
    this._obj.regimenPhases = this._generateRegimenPhases(
      this._obj.regimenGoal, 
      this._obj.regimenParam,
      this._obj.startDate
    )
    return Object.assign({}, this._obj);
  }

  _generateRegimenPhases(
    goal: RegimenGoalOption, 
    param: RegimenParamObject, 
    startDate: string
  ): RegimenPhaseObject[] {
    throw new NotImplementedError();
  }

  export(): RegimenObject {
    return Object.assign({}, this._obj);
  }
}

export class IncBaclofenRegimenMaker extends RegimenMaker {
  constructor() {
    super()
    this._obj.type = RegimenTypes.incBaclofen;
  }
  
  setRegimenParam(param: RegimenParamObject): RegimenMaker {
    // param.hasOwn
    if(!_.has(param, RegimenParamKeys.currentDoseMg)) {
      throw TypeError(`Key ${RegimenParamKeys.currentDoseMg} does not exist`);  
    }
    this._obj.regimenParam = param;
    return this;
  }

  _personalizeRegimenGoal(param: RegimenParamObject): RegimenGoalOption {
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let goal;
    if(currentDoseMg < 30) {
      // increase to 30mg
      goal = RegimenGoalOptions.baclofen30mg;
    } else if (currentDoseMg < 60 ) {
      // increase to 60mg
      goal = RegimenGoalOptions.baclofen60mg;
    } else if (currentDoseMg >= 60 ) {
      goal = null
    }
    return goal;
  }

  _personalizeRegimenDurationDays(param: RegimenParamObject): number {
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let days: number = REGIMEN_BACLOFEN_DAYS;
    if(currentDoseMg < 30) {
      // increase to 30mg
      days = BaclofenUtils.computeDaysByDosageDeficit( (30 - currentDoseMg));
    } else if (currentDoseMg < 60 ) {
      // increase to 60mg
      days = BaclofenUtils.computeDaysByDosageDeficit( (60 - currentDoseMg));
    }
    return days;
  }

  _generateRegimenPhases(
    goal: RegimenGoalOption, 
    param: RegimenParamObject, 
    startDate: string
  ) {
    // Initialize
    let regimenPhases: RegimenPhaseObject[] = [];
    let startDateMoment = moment(startDate);
    let weeks = parseInt(this.regimenDurationDays / 7, 10);
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let nextPhaseDoseMg = this._computeInitialPhaseDoseMg(currentDoseMg);

    for(let phase=0; phase < weeks; phase++) {
      let regimenPhase = this._generateRegimenPhase(phase, startDateMoment, nextPhaseDoseMg);
      regimenPhases.push(regimenPhase);
      
      // Next phase
      startDateMoment = startDateMoment.add(7, 'days');
      nextPhaseDoseMg = this._computeNextPhaseDoseMg(nextPhaseDoseMg);
    }

    return regimenPhases;
  }

  _computeInitialPhaseDoseMg(currentDoseMg: number) {
    let currentDoseLevel = parseInt(currentDoseMg/5, 10);
    let nextDoseLevel = currentDoseLevel + 1;
    return nextDoseLevel * 5;

  }

  _computeNextPhaseDoseMg(currentDoseMg: number) {
    return currentDoseMg += 5;
  }

  _generateRegimenPhase(
    phase: number, 
    startDate: moment, 
    doseForThisPhaseMg: number): RegimenPhaseObject 
  {
    return {
      phase: phase, 
      startDate: startDate.format(DateFormatISO8601),
      endDate: startDate.add(7, 'days').format(DateFormatISO8601),
      treatments: BaclofenRegimenPhaseDef[`${doseForThisPhaseMg}mg`]
    };
  }

}

export class DecBaclofenRegimenMaker extends RegimenMaker {
  constructor() {
    super()
    this._obj.type = RegimenTypes.decBaclofen;
  }

  setRegimenParam(param: RegimenParamObject): RegimenMaker {
    if(!_.has(param, RegimenParamKeys.currentDoseMg)) {
      throw TypeError(`Key ${RegimenParamKeys.currentDoseMg} does not exist`);  
    }
    this._obj.regimenParam = param;
    return this;
  }

  _personalizeRegimenGoal(param: RegimenParamObject): RegimenGoalOption {
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let goal;
    if(currentDoseMg > 30) {
      // increase to 30mg
      goal = RegimenGoalOptions.baclofen30mg;
    } else {
      // increase to 60mg
      goal = RegimenGoalOptions.baclofen60mg;
    } 
    return goal;
  }

  _personalizeRegimenDurationDays(param: RegimenParamObject): number {
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let days: number = REGIMEN_BACLOFEN_DAYS;
    if(currentDoseMg < 30) {
      // increase to 30mg
      days = BaclofenUtils.computeDaysByDosageDeficit(currentDoseMg - 30);
    } else if (currentDoseMg < 60 ) {
      // increase to 60mg
      days = BaclofenUtils.computeDaysByDosageDeficit(currentDoseMg = 60);
    }
    return days;
  }

  _generateRegimenPhases(
    goal: RegimenGoalOption, 
    param: RegimenParamObject, 
    startDate: string
  ): RegimenPhaseObject {
    // Initialize
    let regimenPhases: RegimenPhaseObject[] = [];
    let startDateMoment = moment(startDate);
    let weeks = parseInt(this.regimenDurationDays / 7, 10);
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let nextPhaseDoseMg = this._computeInitialPhaseDoseMg(currentDoseMg);

    for(let phase=0; phase < weeks; phase++) {
      let regimenPhase = this._generateRegimenPhase(phase, startDateMoment, nextPhaseDoseMg);
      regimenPhases.push(regimenPhase);
      
      // Next phase
      startDateMoment = startDateMoment.add(7, 'days');
      nextPhaseDoseMg = this._computeNextPhaseDoseMg(nextPhaseDoseMg);
    }

    return regimenPhases;
  }

  _computeInitialPhaseDoseMg(currentDoseMg: number) {
    let currentDoseLevel = parseInt(currentDoseMg/5, 10);
    let nextDoseLevel = currentDoseLevel - 1;
    return nextDoseLevel * 5;
  }

  _computeNextPhaseDoseMg(currentDoseMg: number) {
    return currentDoseMg -= 5;
  }

  _generateRegimenPhase(
    phase: number, 
    startDate: moment, 
    doseForThisPhaseMg: number): RegimenPhaseObject 
  {
    return {
      phase: phase, 
      startDate: startDate.format(DateFormatISO8601),
      endDate: startDate.add(7, 'days').format(DateFormatISO8601),
      treatments: BaclofenRegimenPhaseDef[`${doseForThisPhaseMg}mg`]
    };
  }
}

class BaclofenUtils {
  static computeWeeksByDosageDeficit(deficitDoseMg: number) {
    return parseInt(deficitDoseMg/5, 10);
  }

  static computeDaysByDosageDeficit(deficitDoseMg: number) {
    let weeks = BaclofenUtils.computeWeeksByDosageDeficit(deficitDoseMg);
    return weeks * 7;
  }
}