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
import { Regimen, IRegimenPhase, BaclofenRegimenPhase } from "./";
import moment from "moment";
import _ from "lodash";
import { BaclofenRegimenPhaseDef, BaclofenUtils, REGIMEN_BACLOFEN_DAYS } from "./";

export class DecBaclofenRegimen extends Regimen {
  constructor() {
    super()
    this._obj.type = RegimenTypes.decBaclofen;
  }

  setRegimenParam(param: RegimenParamObject): Regimen {
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
      // decrease to 30mg
      goal = RegimenGoalOptions.baclofen30mg;
    } else {
      // increase to 60mg
      goal = RegimenGoalOptions.baclofen0mg;
    } 
    return goal;
  }

  _personalizeRegimenDurationDays(param: RegimenParamObject): number {
    let currentDoseMg = ((param.currentDoseMg: any): number);
    let days: number = REGIMEN_BACLOFEN_DAYS;
    if(currentDoseMg < 30) {
      // decrease to 0mg
      days = BaclofenUtils.computeDaysByDosageDeficit(currentDoseMg);
    } else if (currentDoseMg < 60 ) {
      // decrease to 30mg
      days = BaclofenUtils.computeDaysByDosageDeficit(currentDoseMg - 30);
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

    let phaseCounter = 0;
    for(let phase=weeks; phase > 0; phase--) {
      let regimenPhase = this._generateRegimenPhase(phase, startDateMoment, nextPhaseDoseMg);
      regimenPhase.phase = phaseCounter;
      regimenPhases.push(regimenPhase);
      
      // Next phase
      startDateMoment = startDateMoment.add(7, 'days');
      nextPhaseDoseMg = this._computeNextPhaseDoseMg(nextPhaseDoseMg);
      phaseCounter += 1;
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
    doseForThisPhaseMg: number): IRegimenPhase 
  {
    return new BaclofenRegimenPhase(phase, startDate, doseForThisPhaseMg);
  }
}
