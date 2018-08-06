// @flow
import type { 
  TYTrial, 
  TYTreatmentType,
  TYTrialType,
  TYTrialConfig,
  TYReminderConfig,
  TYVarType,
  TYTrialGoal, 
  TYTreatmentPeriod,
  TYTreatment, 
} from "./intecojs/types";
import { 
  TrialTypes,
  VarTypes, 
  StatusOptions,
  TrialConfigKeys,
  TrialGoals,
  TreatmentTypes,
  ReminderTypes,
} from "./intecojs/types";

import { generatePushIDFunc, DateFormatISO8601 } from "./intecojs/utils";
// import appService from "../AppService";
import moment from "moment";
import _ from "lodash";
import { BaclofenTreatmentDef } from "./BaclofenTreatmentDef";

const TRIAL_BACLOFEN_DAYS: number = 7 * 6; // 42

/**
 * A class responsible for generating 
 * Call sequence: 
 *  1. setUserId(uid)
 *  2. setTrialType(...)
 *  3. setTrialConfig(...)
 *  4. confirmTrialConfig(...)
 *  5. setStartDate(...)
 *  6. confirmStartDate(...)
 *  7. make()
 */
export class TrialMaker {
  _data: TYTrial
  prelimTrialDays: number
  generatePushID: () => string

  constructor(data?: TYTrial) {
    let defaultTrial: TYTrial;

    this.generatePushID = generatePushIDFunc();
    if (data === undefined) {
      defaultTrial = {
        tid: this.generatePushID(), 
        uid: "", 
        name: "My New Trial", 
        startDate: moment().format(DateFormatISO8601),
        endDate: moment().add(7, 'days').format(DateFormatISO8601),
        type: TrialTypes.none,
        trialConfig: {},
        trialGoal: TrialGoals.baclofen30mg,
        trackedVars: [
          VarTypes.sleepQuality, 
          VarTypes.spasticitySeverity,
          VarTypes.baclofenAmount,
          VarTypes.tiredness
        ], 
        status: StatusOptions.active, 
        treatmentPeriods: [], 
        reminderConfigs: []
      }
      this._data = defaultTrial;
    } else {
      this._data = data;
    }
  }

  setUserId(uid: string): TrialMaker {
    this._data.uid = uid;
    return this;
  }

  setTrialName(name: string): TrialMaker {
    this._data.name = name;
    return this;
  }

  
  setTrialType(type: TYTrialType): TrialMaker {
    this._data.type = type;
    return this;
  }

  getTrialType(): TYTrialType {
    return this._data.type;
  }

  getTrialDescription(): string {
    let desc: string = "";
    let type = this._data.type;
    console.log(type);
    switch(type) {
      case TrialTypes.incBaclofen: 
      desc = "In this trial, you will experiment how increasing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness." + 
          "This trial will take 1-6 weeks depending on your current Baclofen intake.";
          break;
      case TrialTypes.decBaclofen:
        desc = "In this trial, you will experiment how reducing Baclofen " + 
          "dosage affects your body such as severity of spasticity and tiredness." + 
          "This trial will take 1-6 weeks depending on your current Baclofen intake.";
          break;
      case TrialTypes.none:
        desc = "No type of trial is selected.";
        break;
      default:
        desc = "No type of trial is selected."
    }
    return desc
  }

  setTrialConfig(config: TYTrialConfig): TrialMaker {
    
    // validate config
    if( this._data.type === TrialTypes.decBaclofen || 
      this._data.type === TrialTypes.incBaclofen
    ) {
      if(!config.hasOwnProperty(TrialConfigKeys.currentDoseMg)) {
        throw TypeError(`Config key ${TrialConfigKeys.currentDoseMg} does not exist`); 
      }
    }

    this._data.trialConfig = config;
    return this;
  }

  
  /**
   * Generate personalized trial goal depending on the 
   * trial configuration, including the `type` of trial, 
   * and the detail `config`. 
   * @returns TrialMaker
   */
  confirmTrialConfig(): TrialMaker {
    this._data.trialGoal = this._generateTrialGoal(
      this._data.type, 
      this._data.trialConfig
    );
    this.prelimTrialDays = this._generateTrialLength(
      this._data.type, 
      this._data.trialConfig
    );
    this._data.trackedVars = this._generateDefaultTrackedVars(
      this._data.type
    );
    return this
  }

  _generateTrialGoal(type: TYTrialType, config: TYTrialConfig): TYTrialGoal {
    let goal = TrialGoals.baclofen30mg;

    switch(type) {
      case TrialTypes.incBaclofen: {
        // force casting, first case to any then to the desired type. 
        let currentDoseMg = ((config.currentDoseMg: any): number);
        if(currentDoseMg < 30) {
          // increase to 30mg
          goal = TrialGoals.baclofen30mg;
        } else if (currentDoseMg < 60 ) {
          // increase to 60mg
          goal = TrialGoals.baclofen60mg;
        }
        break;
      }
      
      case TrialTypes.decBaclofen: {
        let currentDoseMg = ((config.currentDoseMg: any): number);
        if(currentDoseMg > 30) {
          // decrease to 30mg
          goal = TrialGoals.baclofen30mg;
        } else {
          // decrease to 0mg
          goal = TrialGoals.baclofen0mg;
        }
        break;
      }
      default: 
        goal = TrialGoals.baclofen30mg;
    }
    return goal;
  }

  _generateTrialLength(type: TYTrialType, config: TYTrialConfig): number {
    let days = TRIAL_BACLOFEN_DAYS;
    switch(type) {
      case TrialTypes.incBaclofen: {
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
      case TrialTypes.decBaclofen: {
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

  _generateDefaultTrackedVars(type: TYTrialType): TYVarType[] {
    let trackedVars = [
      VarTypes.sleepQuality, 
      VarTypes.spasticitySeverity,
      VarTypes.baclofenAmount,
      VarTypes.tiredness
    ];
    return trackedVars;
  }

  addTrackedVar(v: TYVarType): TrialMaker {
    this._data.trackedVars = _.union(this._data.trackedVars, [v]);
    return this;
  }

  removeTrackedVar(v: TYVarType): TrialMaker {
    this._data.trackedVars = _.pull(this._data.trackedVars, v);
    return this;
  }

  getTrackedVars(): TYVarType[] {
    // clone the trackedVars array intead of returning the ref.
    return Array.from(this._data.trackedVars);
  }
  /**
   * Currently 
   * @param  {string} date: the start date of the trial
   * @returns TrialMaker
   */
  setStartDate(date: string): TrialMaker {
    this._data.startDate = date;

    // Automatically generate an endDate based on config. 
    // TODO: Not sure if this will cause an UI update issue. 
    let days = TRIAL_BACLOFEN_DAYS;
    
    this._data.endDate = moment(date)
      .add(this.prelimTrialDays, 'days')
      .format(DateFormatISO8601);
    
    return this;
  }

  confirmTrialDate(): TrialMaker {
    this._data.reminderConfigs = this._generateDefaultReminderConfigs(this._data.type);
    return this;
  }

  getTreatmentAndReminderSlots() {
    switch(this._data.type) {

    }
  }

  _generateTreatmentPeriods(
    type: TYTrialType, 
    goal: TYTrialGoal,
    config: TYTrialConfig,
    startDate: string
  ): TYTreatmentPeriod[] {
    let treatmentPeriods: TYTreatmentPeriod[] = [];
    switch(type) {
      case TrialTypes.incBaclofen: {
        let currentDoseMg = ((config.currentDoseMg: any): number);
        let weeks = 0;
        if(goal === TrialGoals.baclofen30mg) {
          weeks = parseInt( (30 - currentDoseMg)/5, 10);
        } else if (goal === TrialGoals.baclofen60mg) {
          weeks = parseInt( (60 - currentDoseMg)/5, 10);
        }
        let fromDateMoment = moment(startDate);
        let currentSubGoalMg = (parseInt(currentDoseMg/5)+1) * 5;
        for(let period=0; period < weeks; period++) {
          
          treatmentPeriods.push({
            period: period, 
            fromDate: fromDateMoment.format(DateFormatISO8601),
            toDate: fromDateMoment.add(7, 'days').format(DateFormatISO8601),
            treatments: BaclofenTreatmentDef[`${currentSubGoalMg}mg`]
          })
          fromDateMoment = fromDateMoment.add(7, 'days');
          currentSubGoalMg += 5;
        }
        break;
      }
      case TrialTypes.decBaclofen: {
        let currentDoseMg = ((config.currentDoseMg: any): number);
        let weeks = 0;
        if(goal === TrialGoals.baclofen30mg) {
          weeks = parseInt( (currentDoseMg - 30)/5, 10);
        } else if (goal === TrialGoals.baclofen0mg) {
          weeks = parseInt( (currentDoseMg)/5, 10);
        }
        let fromDateMoment = moment(startDate);
        let currentSubGoalMg = (parseInt(currentDoseMg/5)-1) * 5;
        for(let period=0; period < weeks; period++) {
          
          treatmentPeriods.push({
            period: period, 
            fromDate: fromDateMoment.format(DateFormatISO8601),
            toDate: fromDateMoment.add(7, 'days').format(DateFormatISO8601),
            treatments: BaclofenTreatmentDef[`${currentSubGoalMg}mg`]
          })
          fromDateMoment = fromDateMoment.add(7, 'days');
          currentSubGoalMg -= 5;
        }
        break;
      }
      default: {

      }
    }
    return treatmentPeriods
  }
  
  
  // TODO: I haven't figured out how to deal with reminder
  // configuration. Key question: how to allow users to 
  // configure reminders of treatments that can vary over
  // the study periods. Configure individual reminder will 
  // not work, as there are too many. Configure a reminder 
  // filter makes more sense, but that requires some 
  // heuristic to filter treatment (e.g., send reminder 
  // for treatment in the morning but not in the afternoon).
  _generateDefaultReminderConfigs(type: TYTrialType): TYReminderConfig[] {
    let reminderConfigs: TYReminderConfig[] = []
    switch(type) {
      case TrialTypes.incBaclofen:
      case TrialTypes.decBaclofen:
        let treatmentSlots = BaclofenTreatmentDef.slots;
        reminderConfigs = treatmentSlots.map((slot) => {
          return {
            id: this.generatePushID(),
            slotId: slot.id, 
            order: slot.order, 
            type: ReminderTypes.daily,
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

  setReminderConfig(id: string, newConfig: TYReminderConfig): TrialMaker {
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
  make(): TYTrial {
    this._data.treatmentPeriods = this._generateTreatmentPeriods(
      this._data.type, 
      this._data.trialGoal,
      this._data.trialConfig,
      this._data.startDate
    )
    return this._data;
  }

  /**
   * Pause a trial 
   */
  pause() {

  }
  
  export(): TYTrial {
    return this._data;
  }

}