// @flow
import type {
  RegimenPhaseObject,
  TreatmentObject,
  RegimenType,
} from "../../libs/intecojs";
import moment from "moment";
import { 
  DateFormatISO8601, 
  DateFormatTimeOfDay,
  Utils,
  RegimenTypes,
} from "../../libs/intecojs";
import { 
  BaclofenRegimenPhaseDef,
} from "./BaclofenRegimenPhaseDef";
import { Treatment } from "./Treatment";
import _ from "lodash";

// export class RegimenPhaseFactory {
//   static create(
//     type: RegimenType,
//     phase: number, 
//     startDate: moment,
//     doseForThisPhaseMg: ?number = null
//   ): IRegimenPhase {
//     switch(type) {
//       case RegimenTypes.incBaclofen:
//       case RegimenTypes.decBaclofen:
//         return new BaclofenRegimenPhase(phase, startDate, doseFor)
//     }
//   }
// }

export interface IRegimenPhase {

  phase: number;
  startDate: string;
  endDate: string;
  treatments: Treatment[];
  +treatmentObjects: TreatmentObject[];

  toObj(): RegimenPhaseObject;
  sortTreatments(): TreatmentObject[];
  getTreatmentsByPartOfDay(): TreatmentsByPartOfDayObject;
}

export class BaclofenRegimenPhase implements IRegimenPhase {
  phase: number
  id: string
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
    doseForThisPhaseMg: ?number = null
  ) {
    this.phase = phase; 
    this._startDate = moment(startDate);
    this._endDate = moment(startDate).add(6, 'days');

    if( doseForThisPhaseMg) {
      let treatmentObjects: TreatmentObject[] 
        = BaclofenRegimenPhaseDef[`${doseForThisPhaseMg}mg`];
    
      this.treatments = _.map(treatmentObjects, (treatmentObject: TreatmentObject) => {
        return new Treatment(treatmentObject);
      })
    } else {
      this.treatments = [];
    }
  }

  static createFromObj(obj: RegimenPhaseObject): IRegimenPhase {
    let regimenPhase = new BaclofenRegimenPhase(
      obj.phase,
      moment(obj.startDate)
    )

    regimenPhase.treatments = _.map(obj.treatments, (treatmentObject) => {
      return new Treatment(treatmentObject);
    })
    
    return regimenPhase;
  }

  toObj(): RegimenPhaseObject {
    let treatmentObjects = this._treatmentsToObjects(this.treatments);
    return {
      phase: this.phase, 
      startDate: this.startDate,
      endDate: this.endDate, 
      treatments: treatmentObjects
    }
  }

  get treatmentObjects(): TreatmentObject[] {
    return this._treatmentsToObjects(this.treatments)
  }

  sortTreatments(): TreatmentObject[] {
    let treatments: Treatment[] = _.sortBy(this.treatments, (treatment) => {
      return moment(treatment.time, DateFormatTimeOfDay).unix();
    })
    return this._treatmentsToObjects(treatments)
  }

  _treatmentsToObjects(treatments: Treatment[]) {
    return _.map(treatments, (t) => { return t.toObj() });
  }

  getTreatmentsByPartOfDay(): TreatmentsByPartOfDayObject {
    let treatmentByPartOfDayObject: TreatmentsByPartOfDayObject = {
      [PartOfDayOptions.morning]: [], 
      [PartOfDayOptions.afternoon]: [],
      [PartOfDayOptions.evening]: []
    };

    for(let treatment of this.treatments) {
      let partOfDay = treatment.getPartOfDay();
      treatmentByPartOfDayObject[partOfDay].push(treatment);
    }
    return treatmentByPartOfDayObject;
  }
}


export const PartOfDayOptions = {
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening"
} 

export type TreatmentsByPartOfDayObject = {
  // [PartOfDayOptions.morning]: Treatment[],
  // [PartOfDayOptions.afternoon]: Treatment[],
  // [PartOfDayOptions.evening]: Treatment[] 
  morning: Treatment[],
  afternoon: Treatment[],
  evening: Treatment[],
}