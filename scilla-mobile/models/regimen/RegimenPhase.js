// @flow
import type {
  RegimenPhaseObject,
  TreatmentObject,
} from "../../libs/intecojs";
import moment from "moment";
import { DateFormatISO8601, DateFormatTimeOfDay } from "../../libs/intecojs";
import { 
  BaclofenRegimenPhaseDef,
  // Treatment
} from "./";
import { Treatment } from "./Treatment";
import _ from "lodash";

export interface IRegimenPhase {

  phase: number;
  startDate: string;
  endDate: string;
  treatments: Treatment[];
  +treatmentObjects: TreatmentObject[];

  toObj(): RegimenPhaseObject;
  sortTreatments(): TreatmentObject[];

  // static
  // getTreatmentPartOfDate(): string;
}

export class BaclofenRegimenPhase implements IRegimenPhase {
  phase: number

  _startDate: moment
  get startDate(): string { return this._startDate.format(DateFormatISO8601)}
  set startDate(newValue: string) { 
    this._startDate = moment(newValue, DateFormatISO8601);
  } 
  _endDate: moment
  get endDate(): string {return this._endDate.format(DateFormatISO8601)}
  set endDate(newValue: string) {
    this._endDate = moment(newValue, DateFormatISO8601);
  }
  doseForThisPhaseMg: number
  treatments: Treatment[]

  constructor(
    phase: number, 
    startDate: moment, 
    doseForThisPhaseMg: number
  ) {
    this.phase = phase; 
    this._startDate = moment(startDate);
    this._endDate = moment(startDate).add(7, 'days');
    this.doseForThisPhaseMg = doseForThisPhaseMg;

    let treatmentObjects: TreatmentObject[] 
      = BaclofenRegimenPhaseDef[`${doseForThisPhaseMg}mg`];
    
    this.treatments = treatmentObjects.map( (treatmentObject) => {
      return new Treatment(treatmentObject);
    })
  }

  toObj(): RegimenPhaseObject {
    let treatmentObjects = this.treatments.map( (t) => { return t.toObj() });
    return {
      phase: this.phase, 
      startDate: this.startDate,
      endDate: this.endDate, 
      treatments: treatmentObjects
    }
  }

  get treatmentObjects(): TreatmentObject {
    return this.treatments.map( (t) => { return t.toObj() });
  }

  sortTreatments(): TreatmentObject[] {
    return _.sortBy(this.treatments, (treatment) => {
      return moment(treatment.time, DateFormatTimeOfDay).unix();
    })
  }
}