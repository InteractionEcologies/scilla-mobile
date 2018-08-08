// @flow
import type { 
  RegimenObject, 
  TreatmentDetailOption,
  RegimentOption,
  RegimenParamObject,
  ReminderConfigObject,
  MeasurementType,
  RegimenGoalOption, 
  RegimenPhaseObject,
  TreatmentObject, 
} from "./intecojs/types";
import { 
  RegimenOptions,
  MeasurementTypes, 
  StatusOptions,
  RegimenParamKeys,
  RegimenGoalOptions,
  TreatmentDetailOptions,
  ReminderFrequencyOptions,
} from "./intecojs/types";

import { generatePushIDFunc, DateFormatISO8601 } from "./intecojs/utils";
// import appService from "../AppService";
import moment from "moment";
import _ from "lodash";
import { BaclofenRegimenPhaseDef } from "./BaclofenRegimenPhaseDef";

const TRIAL_BACLOFEN_DAYS: number = 7 * 6; // 42

/**
 * A class responsible for generating 
 * Call sequence: 
 *  1. setUserId(uid)
 *  2. setRegimenType(...)
 *  3. setRegimenConfig(...)
 *  4. confirmRegimenConfig(...)
 *  5. setStartDate(...)
 *  6. confirmStartDate(...)
 *  7. make()
 */
export class RegimenMaker {
  _data: RegimenObject
  prelimRegimenDays: number
  generatePushID: () => string

  constructor(data?: RegimenObject) {
    let defaultRegimen: RegimenObject;

    this.generatePushID = generatePushIDFunc();
    if (data === undefined) {
      defaultRegimen = {
        tid: this.generatePushID(), 
        uid: "", 
        name: "My New Regimen", 
        startDate: moment().format(DateFormatISO8601),
        endDate: moment().add(7, 'days').format(DateFormatISO8601),
        type: RegimenOptions.undefined,
        regimenParam: {},
        regimenGoal: RegimenGoalOptions.baclofen30mg,
        trackedVars: [
          MeasurementTypes.sleepQuality, 
          MeasurementTypes.spasticitySeverity,
          MeasurementTypes.baclofenAmount,
          MeasurementTypes.tiredness
        ], 
        status: StatusOptions.active, 
        treatmentPeriods: [], 
        reminderConfigs: []
      }
      this._data = defaultRegimen;
    } else {
      this._data = data;
    }
  }

  setUserId(uid: string): RegimenMaker {
    this._data.uid = uid;
    return this;
  }

  setRegimenName(name: string): RegimenMaker {
    this._data.name = name;
    return this;
  }

  
  setRegimenType(type: RegimentOption): RegimenMaker {
    this._data.type = type;
    return this;
  }

  getRegimenType(): RegimentOption {
    return this._data.type;
  }

  

  setRegimenConfig(config: RegimenParamObject): RegimenMaker {
    
    // validate config
    if( this._data.type === RegimenOptions.decBaclofen || 
      this._data.type === RegimenOptions.incBaclofen
    ) {
      if(!config.hasOwnProperty(RegimenParamKeys.currentDoseMg)) {
        throw TypeError(`Config key ${RegimenParamKeys.currentDoseMg} does not exist`); 
      }
    }

    this._data.regimenParam = config;
    return this;
  }

  
  /**
   * Generate personalized regimen goal depending on the 
   * regimen configuration, including the `type` of regimen, 
   * and the detail `config`. 
   * @returns RegimenMaker
   */
  confirmRegimenConfig(): RegimenMaker {
    this._data.regimenGoal = this._generateRegimenGoal(
      this._data.type, 
      this._data.regimenParam
    );
    this.prelimRegimenDays = this._generateRegimenLength(
      this._data.type, 
      this._data.regimenParam
    );
    this._data.trackedVars = this._generateDefaultTrackedVars(
      this._data.type
    );
    return this
  }

  _generateRegimenGoal(type: RegimentOption, config: RegimenParamObject): RegimenGoalOption {
    let goal = RegimenGoalOptions.baclofen30mg;

    switch(type) {
      case RegimenOptions.incBaclofen: {
        // force casting, first case to any then to the desired type. 
        let currentDoseMg = ((config.currentDoseMg: any): number);
        if(currentDoseMg < 30) {
          // increase to 30mg
          goal = RegimenGoalOptions.baclofen30mg;
        } else if (currentDoseMg < 60 ) {
          // increase to 60mg
          goal = RegimenGoalOptions.baclofen60mg;
        }
        break;
      }
      
      case RegimenOptions.decBaclofen: {
        let currentDoseMg = ((config.currentDoseMg: any): number);
        if(currentDoseMg > 30) {
          // decrease to 30mg
          goal = RegimenGoalOptions.baclofen30mg;
        } else {
          // decrease to 0mg
          goal = RegimenGoalOptions.baclofen0mg;
        }
        break;
      }
      default: 
        goal = RegimenGoalOptions.baclofen30mg;
    }
    return goal;
  }

  _generateRegimenLength(type: RegimentOption, config: RegimenParamObject): number {
    let days = TRIAL_BACLOFEN_DAYS;
    switch(type) {
      case RegimenOptions.incBaclofen: {
        // force casting, first case to any then to the desired type. 
        let currentDoseMg = ((config.currentDoseMg: any): number);
        if(currentDoseMg < 30) {
          // increase to 30mg
          let weeks = parseInt( (30 - currentDoseMg)/5, 10); 
          days = weeks * 7;
        } else if (currentDoseMg < 60 ) {
          // increase to 60mg
          let weeks = parseInt( (60 - currentDoseMg)/5, 10);
          days = weeks * 7;
        }
        break;
      }
      case RegimenOptions.decBaclofen: {
        let currentDoseMg = ((config.currentDoseMg: any): number);
        if(currentDoseMg > 30) {
          // decrease to 30mg
          let weeks = parseInt( (currentDoseMg - 30)/5, 10); 
          days = weeks * 7;
        } else {
          // decrease to 0mg
          let weeks = parseInt( (currentDoseMg)/5, 10);
          days = weeks * 7;
        }
        break;
      }
      default: 
        days = TRIAL_BACLOFEN_DAYS;
    }

    return days;
  }

  _generateDefaultTrackedVars(type: RegimentOption): MeasurementType[] {
    let trackedVars = [
      MeasurementTypes.sleepQuality, 
      MeasurementTypes.spasticitySeverity,
      MeasurementTypes.baclofenAmount,
      MeasurementTypes.tiredness
    ];
    return trackedVars;
  }

  addTrackedVar(v: MeasurementType): RegimenMaker {
    this._data.trackedVars = _.union(this._data.trackedVars, [v]);
    return this;
  }

  removeTrackedVar(v: MeasurementType): RegimenMaker {
    this._data.trackedVars = _.pull(this._data.trackedVars, v);
    return this;
  }

  getTrackedVars(): MeasurementType[] {
    // clone the trackedVars array intead of returning the ref.
    return Array.from(this._data.trackedVars);
  }
  /**
   * Currently 
   * @param  {string} date: the start date of the regimen
   * @returns RegimenMaker
   */
  setStartDate(date: string): RegimenMaker {
    this._data.startDate = date;

    // Automatically generate an endDate based on config. 
    // TODO: Not sure if this will cause an UI update issue. 
    let days = TRIAL_BACLOFEN_DAYS;
    
    this._data.endDate = moment(date)
      .add(this.prelimRegimenDays, 'days')
      .format(DateFormatISO8601);
    
    return this;
  }

  confirmRegimenDate(): RegimenMaker {
    this._data.reminderConfigs = this._generateDefaultReminderConfigs(this._data.type);
    return this;
  }

  getRegimenAndReminderSlots() {
    switch(this._data.type) {

    }
  }

  _generateRegimenPhases(
    type: RegimentOption, 
    goal: RegimenGoalOption,
    config: RegimenParamObject,
    startDate: string
  ): RegimenPhaseObject[] {
    let regimenPhases: RegimenPhaseObject[] = [];
    switch(type) {
      case RegimenOptions.incBaclofen: {
        let currentDoseMg = ((config.currentDoseMg: any): number);
        let weeks = 0;
        if(goal === RegimenGoalOptions.baclofen30mg) {
          weeks = parseInt( (30 - currentDoseMg)/5, 10);
        } else if (goal === RegimenGoalOptions.baclofen60mg) {
          weeks = parseInt( (60 - currentDoseMg)/5, 10);
        }
        let fromDateMoment = moment(startDate);
        let currentSubGoalMg = (parseInt(currentDoseMg/5)+1) * 5;
        for(let phase=0; phase < weeks; phase++) {
          
          regimenPhases.push({
            phase: phase, 
            fromDate: fromDateMoment.format(DateFormatISO8601),
            toDate: fromDateMoment.add(7, 'days').format(DateFormatISO8601),
            treatments: BaclofenRegimenPhaseDef[`${currentSubGoalMg}mg`]
          })
          fromDateMoment = fromDateMoment.add(7, 'days');
          currentSubGoalMg += 5;
        }
        break;
      }
      case RegimenOptions.decBaclofen: {
        let currentDoseMg = ((config.currentDoseMg: any): number);
        let weeks = 0;
        if(goal === RegimenGoalOptions.baclofen30mg) {
          weeks = parseInt( (currentDoseMg - 30)/5, 10);
        } else if (goal === RegimenGoalOptions.baclofen0mg) {
          weeks = parseInt( (currentDoseMg)/5, 10);
        }
        let fromDateMoment = moment(startDate);
        let currentSubGoalMg = (parseInt(currentDoseMg/5)-1) * 5;
        for(let phase=0; phase < weeks; phase++) {
          
          regimenPhases.push({
            phase: phase, 
            fromDate: fromDateMoment.format(DateFormatISO8601),
            toDate: fromDateMoment.add(7, 'days').format(DateFormatISO8601),
            treatments: BaclofenRegimenPhaseDef[`${currentSubGoalMg}mg`]
          })
          fromDateMoment = fromDateMoment.add(7, 'days');
          currentSubGoalMg -= 5;
        }
        break;
      }
      default: {

      }
    }
    return regimenPhases
  }
  
  
  // TODO: I haven't figured out how to deal with reminder
  // configuration. Key question: how to allow users to 
  // configure reminders of treatments that can vary over
  // the study periods. Configure individual reminder will 
  // not work, as there are too many. Configure a reminder 
  // filter makes more sense, but that requires some 
  // heuristic to filter treatment (e.g., send reminder 
  // for treatment in the morning but not in the afternoon).
  _generateDefaultReminderConfigs(type: RegimentOption): ReminderConfigObject[] {
    let reminderConfigs: ReminderConfigObject[] = []
    switch(type) {
      case RegimenOptions.incBaclofen:
      case RegimenOptions.decBaclofen:
        let treatmentSlots = BaclofenRegimenPhaseDef.slots;
        reminderConfigs = treatmentSlots.map((slot) => {
          return {
            id: this.generatePushID(),
            slotId: slot.id, 
            order: slot.order, 
            frequency: ReminderFrequencyOptions.daily,
            time: slot.defaultTime, 
            actionOrTreatmentType: slot.actionType
          }
        });
        break;
      default: 
        reminderConfigs = [];
    }
    return reminderConfigs;
  }

  setReminderConfig(id: string, newConfig: ReminderConfigObject): RegimenMaker {
    this._data.reminderConfigs = this._data.reminderConfigs.map( (config) => {
      if(config.id === id) {
        return newConfig;
      } 
      return config;
    })
    return this;
  }

  setReminderTime(id: string, time: string) {
    this._data.reminderConfigs = this._data.reminderConfigs.map( (config) => {
      if(config.id === id) {
        config.time = time;
        return config;
      } 
      return config;
    })
    return this;
  }

  /**
   * Auto-fill the treatment periods 
   */
  make(): RegimenObject {
    this._data.treatmentPeriods = this._generateRegimenPhases(
      this._data.type, 
      this._data.regimenGoal,
      this._data.regimenParam,
      this._data.startDate
    )
    return this._data;
  }

  /**
   * Pause a regimen 
   */
  pause() {

  }
  
  export(): RegimenObject {
    return this._data;
  }

}