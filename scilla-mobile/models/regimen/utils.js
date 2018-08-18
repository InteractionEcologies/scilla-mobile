// @flow
import type {
  TreatmentObject
} from "../../libs/intecojs";

import {
  TreatmentDetailOption,
  DateFormatTimeOfDay,
} from "../../libs/intecojs";
import { Regimen } from "./";
import moment from "moment";
import _ from "lodash";

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

  static MORNING = "morning"
  static AFTERNOON = "afternoon";
  static EVENING = "evening";

  static sortTreatments(treatments: TreatmentObject[]) {
    return _.sortBy(treatments, (treatmentObj) => {
      return moment(treatmentObj.time, DateFormatTimeOfDay).unix();
    })
  }

  static getTreatmentPartOfDay(treatment: TreatmentObject): string {
    let treatmentTime = moment(treatment.time, DateFormatTimeOfDay);
    let treatmentHour = parseFloat(treatmentTime.format("HH"));
    let partOfDay: string;

    if(treatmentHour >= RegimenUtils.splitAfternoon
      && treatmentHour <= RegimenUtils.splitEvening ) {
      partOfDay = RegimenUtils.AFTERNOON;
    } else if(treatmentHour >= RegimenUtils.splitEvening ) {
      partOfDay = RegimenUtils.EVENING;
    } else {
      partOfDay = RegimenUtils.MORNING;
    }
    
    return partOfDay;
  }

  static partOfDay2ArrayIndex(partOfDay: string) {
    let index;
    switch(partOfDay) {
      case RegimenUtils.MORNING: 
        index = RegimenUtils.MorningIndexInPartOfDayArray; 
        break;
      case RegimenUtils.AFTERNOON: 
        index = RegimenUtils.AfternoonIndexInPartOfDayArray; 
        break;
      case RegimenUtils.MORNING: 
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