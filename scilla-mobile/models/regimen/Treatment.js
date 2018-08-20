// @flow
import type { 
  TreatmentDetailOption,
  TreatmentObject
} from "../../libs/intecojs";

import type {
  
} from "../../libs/intecojs/types/scilla";

import {
  DateFormatTimeOfDay,
  TreatmentDetailOptions,
  Utils,
} from "../../libs/intecojs";
import { 
  SPLIT_AFTERNOON,
  SPLIT_EVENING,
  PartOfDayOptions,
} from "./"
import _ from "lodash";
import moment from "moment";

export class Treatment {
  _obj: TreatmentObject
  id: string
  time: string
  timeDesc: ?string
  option: TreatmentDetailOption
  reminderSlotId: string

  constructor(treatmentObj: TreatmentObject) {
    if( treatmentObj.id ) {
      this.id = treatmentObj.id;
    } else {
      this.id = Utils.randomId();
    }
    this.time = treatmentObj.time;
    this.timeDesc = treatmentObj.timeDesc;
    this.option = treatmentObj.option;
    this.reminderSlotId = treatmentObj.reminderSlotId;
  }

  toObj(): TreatmentObject {
    let obj: TreatmentObject = {
      id: this.id,
      time: this.time, 
      option: this.option,
      reminderSlotId: this.reminderSlotId
    }
    if( this.timeDesc ) {
      obj["timeDesc"] = this.timeDesc;
    }
    return obj;
  }

  getPartOfDay(): string {
    let treatmentTime = moment(this.time, DateFormatTimeOfDay);
    let treatmentHour = parseFloat(treatmentTime.format("HH"));
    let partOfDay: string;

    if(treatmentHour >= SPLIT_AFTERNOON
      && treatmentHour <= SPLIT_EVENING ) {
      partOfDay = PartOfDayOptions.afternoon;
    } else if(treatmentHour >= SPLIT_EVENING) {
      partOfDay = PartOfDayOptions.evening;
    } else {
      partOfDay = PartOfDayOptions.morning;
    }
    
    return partOfDay;
  }

  getShortDescription(): string {
    switch(this.option) {
      case TreatmentDetailOptions.baclofen5mg:
        return "5 mg";
      case TreatmentDetailOptions.baclofen10mg:
        return "10 mg";
      case TreatmentDetailOptions.baclofen15mg:
        return "15 mg";
      case TreatmentDetailOptions.baclofen20mg:
        return "20 mg";
      default:
        return "";
    }
  }
}