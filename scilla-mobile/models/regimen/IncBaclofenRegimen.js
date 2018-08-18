// @flow
import type {
  RegimenParamObject,
  RegimenGoalOption,
  RegimenPhaseObject,
  
} from "../../libs/intecojs";

import {
  RegimenTypes, 
  RegimenParamKeys, 
  RegimenGoalOptions,
  DateFormatISO8601,
} from "../../libs/intecojs";
import { Regimen, IRegimenPhase } from "./";
import moment from "moment";
import _ from "lodash";
import { 
  BaclofenRegimenPhaseDef, 
  BaclofenUtils, 
  REGIMEN_BACLOFEN_DAYS,
  BaclofenRegimenPhase,
} from "./";

export class IncBaclofenRegimen extends Regimen {

  regimenPhases: IRegimenPhase[] = [];

  constructor() {
    super()
    this._obj.type = RegimenTypes.incBaclofen;
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
  ): IRegimenPhase[] {
    // Initialize
    let regimenPhases: IRegimenPhase[] = [];
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
    doseForThisPhaseMg: number): IRegimenPhase 
  {
    // return {
    //   phase: phase, 
    //   startDate: startDate.format(DateFormatISO8601),
    //   endDate: startDate.add(7, 'days').format(DateFormatISO8601),
    //   treatments: BaclofenRegimenPhaseDef[`${doseForThisPhaseMg}mg`]
    // };
    return new BaclofenRegimenPhase(phase, startDate, doseForThisPhaseMg);
  }

}