// @flow
import type {
  TreatmentObject,
  TreatmentDetailOption
} from "../../libs/intecojs";

import {
  DateFormatTimeOfDay,
} from "../../libs/intecojs";
import { Regimen } from "./";
import moment from "moment";
import _ from "lodash";
import { PartOfDayOptions } from "./";

export class BaclofenUtils {
  static computeWeeksByDosageDeficit(deficitDoseMg: number): number {
    return parseInt(deficitDoseMg/5, 10);
  }

  static computeDaysByDosageDeficit(deficitDoseMg: number): number {
    let weeks = BaclofenUtils.computeWeeksByDosageDeficit(deficitDoseMg);
    return weeks * 7;
  }

  static convertTreatmentDetailOptionToFriendlyName(option: TreatmentDetailOption): string
  {
    // switch(option) {
    //   case TreatmentDetailOptions.baclofen5mg: 
    //     valuesForPillTableRow.push("5 mg");
    //     break;
    //   case TreatmentDetailOptions.baclofen10mg:
    //     valuesForPillTableRow.push("10 mg");
    //     break;
    //   case TreatmentDetailOptions.baclofen15mg:
    //     valuesForPillTableRow.push("15 mg");
    //     break;
    //   case TreatmentDetailOptions.baclofen20mg:
    //     valuesForPillTableRow.push("20 mg");
    //     break;
    // }
    return ""
  }
}

export class RegimenUtils {
  static splitAfternoon: number = 12
  static splitEvening: number = 17
  
  static MorningIndexInPartOfDayArray = 0;
  static AfternoonIndexInPartOfDayArray = 1;
  static EveningIndexInPartOfDayArray = 2;

  static sortTreatments(treatments: TreatmentObject[]) {
    return _.sortBy(treatments, (treatmentObj) => {
      return moment(treatmentObj.time, DateFormatTimeOfDay).unix();
    })
  }

  static partOfDay2ArrayIndex(partOfDay: string) {
    let index;
    switch(partOfDay) {
      case PartOfDayOptions.morning: 
        index = RegimenUtils.MorningIndexInPartOfDayArray; 
        break;
      case PartOfDayOptions.afternoon: 
        index = RegimenUtils.AfternoonIndexInPartOfDayArray; 
        break;
      case PartOfDayOptions.evening: 
        index = RegimenUtils.EveningIndexInPartOfDayArray; 
        break;
      default:
        throw TypeError(`invalid part of day ${partOfDay}`);
    }
    return index;
  }

  static convertTreatmentsToPartOfDayArray(treatments: TreatmentObject[]): string[] {
    // let podArray = new Array(3);
    // for(let treatment of treatments) {
    //   let partOfDay = RegimenUtils.getTreatmentPartOfDay(treatment);
    //   let index = RegimenUtils.partOfDay2ArrayIndex(partOfDay);
    //   podArray[index] = treatment.
    // }
    return [];
  }
}