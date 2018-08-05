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
} from "./intecojs/types";

import { generatePushIDFunc, DateFormatISO8601 } from "./intecojs/utils";
// import appService from "../AppService";
import moment from "moment";
import _ from "lodash";
import { BaclofenTreatmentDef } from "./BaclofenTreatmentDef";

const TRIAL_BACLOFEN_DAYS: number = 7 * 6; // 42

/**
 * A class responsible for generating 
 */
export class TrialHelper {
  _data: TYTrial
  prelimTrial: any

  constructor(data?: TYTrial) {
    let defaultTrial: TYTrial;
    if (data === undefined) {
      defaultTrial = {
        tid: generatePushIDFunc()(), 
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

  setUserId(uid: string): TrialHelper {
    this._data.uid = uid;
    return this;
  }

  setTrialName(name: string): TrialHelper {
    this._data.name = name;
    return this;
  }

  
  setTrialType(type: TYTrialType): TrialHelper {
    this._data.type = type;
    this._generateDefaultTrackedVars(type);
    return this;
  }

  setTrialConfig(config: TYTrialConfig): TrialHelper {
    
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

  generateTrialGoal(): TrialHelper {
    let goal;

    switch(this._data.type) {
      case TrialTypes.incBaclofen: {
        // force casting, first case to any then to the desired type. 
        let currentDoseMg = ((this._data.trialConfig.currentDoseMg: any): number);
        if(currentDoseMg < 30) {
          // increase to 30mg
          goal = TrialGoals.baclofen30mg;
        } else if (currentDoseMg < 60 ) {
          // increase to 60mg
          goal = TrialGoals.baclofen60mg;
        }
      }
      case TrialTypes.decBaclofen: {
        let currentDoseMg = ((this._data.trialConfig.currentDoseMg: any): number);
        if(currentDoseMg > 30) {
          // decrease to 30mg
          goal = TrialGoals.baclofen30mg;
        } else {
          // decrease to 0mg
          goal = TrialGoals.baclofen0mg;
        }
      }
      default: 
        goal = TrialGoals.baclofen30mg;
    }
    this._data.trialGoal = goal;
    
    this._generatePrelimTrial()
    return this;
  }

  _generateDefaultTrialLength() {

  }

  _generatePrelimTrial(): TrialHelper {
    let days = TRIAL_BACLOFEN_DAYS;

    switch(this._data.type) {
      case TrialTypes.incBaclofen: {
        // force casting, first case to any then to the desired type. 
        let currentDoseMg = ((this._data.trialConfig.currentDoseMg: any): number);
        if(currentDoseMg < 30) {
          // increase to 30mg
          let weeks = parseInt( (30 - currentDoseMg)/5, 10); 
          days = weeks * 7;
        } else if (currentDoseMg < 60 ) {
          // increase to 60mg
          let weeks = parseInt( (60 - currentDoseMg)/5, 10);
          days = weeks * 7;
        }
      }
      case TrialTypes.decBaclofen: {
        let currentDoseMg = ((this._data.trialConfig.currentDoseMg: any): number);
        if(currentDoseMg > 30) {
          // decrease to 30mg
          let weeks = parseInt( (currentDoseMg - 30)/5, 10); 
          days = weeks * 7;
        } else {
          // decrease to 0mg
          let weeks = parseInt( (currentDoseMg)/5, 10);
          days = weeks * 7;
        }
      }
      default: 
        days = TRIAL_BACLOFEN_DAYS;
    }

    this.prelimTrial = {
      days: days
    }
    return this;
  }

  _generateDefaultTrackedVars(type: TYTrialType): TrialHelper {
    this._data.trackedVars = [
      VarTypes.sleepQuality, 
      VarTypes.spasticitySeverity,
      VarTypes.baclofenAmount,
      VarTypes.tiredness
    ];
    return this;
  }

  addTrackedVar(v: TYVarType): TrialHelper {
    this._data.trackedVars = _.union(this._data.trackedVars, [v]);
    return this;
  }

  removeTrackedVar(v: TYVarType): TrialHelper {
    this._data.trackedVars = _.pull(this._data.trackedVars, v);
    return this;
  }

  setStartDate(date: string): TrialHelper {
    this._data.startDate = date;

    // Automatically generate an endDate based on config. 
    // TODO: Not sure if this will cause an UI update issue. 
    let days = TRIAL_BACLOFEN_DAYS;
    
    this._data.endDate = moment(date)
      .add(this.prelimTrial.days, 'days')
      .format(DateFormatISO8601);
    
    return this;
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
  _generateDefaultReminderConfigs(): TYReminderConfig[] {
    return [
      {
        id: 1,
        type: "daily",
        time: "08:30",
        actionOrTreatmentType: "baclofen"
      },
      {
        id: 2,
        type: "daily",
        time: "12:30",
        actionOrTreatmentType: "baclofen"
      },
      {
        id: 3,
        type: "daily",
        time: "18:30",
        actionOrTreatmentType: "baclofen"
      }
    ]
  }

  setReminderConfig(id: number, newConfig: TYReminderConfig): TrialHelper {
    this._data.reminderConfigs = this._data.reminderConfigs.map( (config) => {
      if(config.id == id) {
        return newConfig;
      } 
      return config;
    })
    return this;
  }

  /**
   * Auto-fill the treatment periods 
   */
  make(): TrialHelper {
    this._data.treatmentPeriods = this._generateTreatmentPeriods(
      this._data.type, 
      this._data.trialGoal,
      this._data.trialConfig,
      this._data.startDate
    )
    this._data.reminderConfigs = this._generateDefaultReminderConfigs();

    return this;
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