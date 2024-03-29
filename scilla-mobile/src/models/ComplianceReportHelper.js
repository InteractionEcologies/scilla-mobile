// @flow

import type { 
  ComplianceReportObject, 
  ComplianceStatus
} from "../libs/scijs";
import {
  DateFormatTimeOfDay,
  ComplianceStatusOptions
} from "../libs/scijs"
import moment from "moment";

export class ComplianceReportHelper {
  static toggleSkipAndGetNewStatus(report: ComplianceReportObject): ComplianceStatus {
    let {status } = report;
    if(status === ComplianceStatusOptions.skip) {
      status = ComplianceStatusOptions.undefined
    } else if (status === ComplianceStatusOptions.took) {
      status = ComplianceStatusOptions.skip
    } else {
      status = ComplianceStatusOptions.skip
    }
    return status
  }

  static toggleTakeAndGetNewStatus(report: ComplianceReportObject): ComplianceStatus {
    let { status } = report;
    if( status === ComplianceStatusOptions.skip) {
      status = ComplianceStatusOptions.took
    } else if (status === ComplianceStatusOptions.took) {
      status = ComplianceStatusOptions.undefined
    } else {
      status = ComplianceStatusOptions.took
    }
    return status;
  }

  static getNewSnoozeTime(report: ComplianceReportObject): number {
    let { expectedTreatmentTime } = report;
  
    let time = moment(expectedTreatmentTime, DateFormatTimeOfDay);
    time.add(10, 'minutes');
    return time.unix();
  }

}