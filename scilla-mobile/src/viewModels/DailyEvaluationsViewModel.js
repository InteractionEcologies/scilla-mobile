// @flow
import type { 
  DateTypeISO8601,
  DailyEvaluationObject 
} from "../libs/scijs";

import Colors from "../constants/Colors";
import _ from "lodash";

export class DailyEvaluationsViewModel {

  dailyEvals: DailyEvaluationObject[] = []

  constructor(dailyEvals: DailyEvaluationObject[]) {
    this.dailyEvals = dailyEvals;
  }

  getMarkedDatesObj = (selectedDateStr: ?DateTypeISO8601 = null): Object => {
    let markedDates = {}
    _.forEach(this.dailyEvals, (report: DailyEvaluationObject) => {
      markedDates[report.date] = {
          'dotColor': Colors.accentColor,
          'marked': true
      }
    });

    if(selectedDateStr) {
      let selectedDateConfig = Object.assign({}, 
        // copy whatever properties if the user has already reported for the selected date. 
        markedDates[selectedDateStr], 
        { 'selected': true }
      )
      markedDates[selectedDateStr] = selectedDateConfig;
    }
    return markedDates;
  }

}