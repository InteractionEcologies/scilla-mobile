// @flow
import type {
  RegimenParamObject,
  RegimenGoalOption,
  RegimenPhaseObject,
  RegimenObject,
} from "../../libs/intecojs";

import {
  RegimenTypes, 
  RegimenParamKeys, 
  RegimenGoalOptions,
  DateFormatISO8601,
} from "../../libs/intecojs";
import { Regimen } from "./Regimen";
import { IRegimenPhase } from "./RegimenPhase";
import moment from "moment";
import _ from "lodash";
import { BaclofenRegimenPhaseDef } from "./BaclofenRegimenPhaseDef";
import { REGIMEN_BACLOFEN_DAYS } from "./constants"
import { BaclofenRegimenPhase } from "./RegimenPhase";
import { BaclofenUtils } from "./utils";

export class IncBaclofenRegimen extends Regimen {

  regimenPhases: IRegimenPhase[] = [];
  static DoseThreasholdFor30mgGoal = 25;
  static DoseFor30mgGoal = 30;
  static MaxDoseAcceptable = 60;

  constructor() {
    super()
    this._obj.type = RegimenTypes.incBaclofen;
  }

  updateFromObj(obj: RegimenObject) {
    // Doesn't allow others to change its type
    var clonedObj = Object.assign({}, obj);
    clonedObj.type = this._obj.type;
    this._obj = clonedObj;

    this.regimenPhases = _.map(this._obj.regimenPhases, (rp) => {
      return new BaclofenRegimenPhase.createFromObj(rp);
    })
  }
  
  setRegimenParam(param: RegimenParamObject): Regimen {
    // param.hasOwn
    if(!_.has(param, RegimenParamKeys.currentDoseMg)) {
      throw TypeError(`Key ${RegimenParamKeys.currentDoseMg} does not exist`);  
    }
    this._obj.regimenParam = param;
    return this;
  }

  _personalizeRegimenGoal(param: RegimenParamObject): RegimenGoalOption {
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let goal: RegimenGoalOption = RegimenGoalOptions.undefined;
    if(currentDoseMg <= IncBaclofenRegimen.DoseThreasholdFor30mgGoal) {
      // increase to 30mg
      goal = RegimenGoalOptions.baclofen30mg;
    } else if (currentDoseMg < IncBaclofenRegimen.MaxDoseAcceptable  ) {
      // increase to 60mg
      goal = RegimenGoalOptions.baclofen60mg;
    } else if (currentDoseMg >= IncBaclofenRegimen.MaxDoseAcceptable  ) {
      goal = RegimenGoalOptions.undefined;
    }
    return goal;
  }

  _personalizeRegimenDurationDays(param: RegimenParamObject): number {
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let days: number = REGIMEN_BACLOFEN_DAYS;
    if(currentDoseMg < IncBaclofenRegimen.DoseThreasholdFor30mgGoal) {
      // increase to 30mg
      days = BaclofenUtils.computeDaysByDosageDeficit( 
        (IncBaclofenRegimen.DoseFor30mgGoal- currentDoseMg)
      );
    } else if (currentDoseMg < IncBaclofenRegimen.MaxDoseAcceptable ) {
      // increase to 60mg
      days = BaclofenUtils.computeDaysByDosageDeficit( 
        (IncBaclofenRegimen.MaxDoseAcceptable - currentDoseMg)
      );
    }
    return days;
  }

  _generateRegimenPhases(
    goal: RegimenGoalOption, 
    param: RegimenParamObject, 
    startDate: string
  ): IRegimenPhase[] {
    // Initialize
    let regimenPhases: IRegimenPhase[] = [];
    let startDateMoment = moment(startDate);
    let weeks = parseInt(this.regimenDurationDays / 7, 10);
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let nextPhaseDoseMg = this._computeInitialPhaseDoseMg(currentDoseMg);

    for(let phase=0; phase < weeks; phase++) {
      let regimenPhase = this._generateRegimenPhase(phase, startDateMoment, nextPhaseDoseMg);
      // override phase number. 
      regimenPhase.phase = phase;
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
    doseForThisPhaseMg: number): IRegimenPhase 
  {
    return new BaclofenRegimenPhase(phase, startDate, doseForThisPhaseMg);
  }

}