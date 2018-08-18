// @flow
import type { 
  TreatmentObject,
  TreatmentDetailOption
} from "../../libs/intecojs";
import _ from "lodash";

export class Treatment {
  _obj: TreatmentObject
  time: string
  timeDesc: string
  option: TreatmentDetailOption
  reminderSlotId: string

  constructor(treatmentObj: TreatmentObject) {
    this.time = treatmentObj.time;
    this.timeDesc = treatmentObj.timeDesc;
    this.option = treatmentObj.option;
    this.reminderSlotId = treatmentObj.reminderSlotId;
  }

  toObj() {
    return {
      time: this.time, 
      timeDesc: this.timeDesc, 
      option: this.option,
      reminderSlotId: this.reminderSlotId
    }
  }
}