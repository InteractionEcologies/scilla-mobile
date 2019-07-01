// @flow
import moment from "moment";
import { IRegimen, DateFormatISO8601 } from "../libs/scijs";
import Colors from "../constants/Colors";
import _ from "lodash";

const SCOPE = "RegimenViewModel";

class RegimenViewModel {
  regimen: IRegimen

  constructor(regimen: IRegimen) {
    this.regimen = regimen;
  }

  get calendarMarkedDateObj(): Object {
    let startDate = moment(this.regimen.startDate);
    let endDate = moment(this.regimen.endDate);

    let markedDates = {}
    let curDate = startDate;

    // We did not use startingDay and endingDay as 
    // there seems to be a bug in Calendar component. 
    // It won't render startingDay and endingDay properly 
    // if we change the markedDates object. 
    let curDateStr = curDate.format(DateFormatISO8601);
    markedDates[curDateStr] = {
      // color: 'green',
      marked: true, 
      color: Colors.primaryColor
    }

    curDate = curDate.add(1, 'day');
    while (curDate.isSameOrBefore(endDate)) {
      let curDateStr = curDate.format(DateFormatISO8601);
      markedDates[curDateStr] = {
        marked: true, 
        color: Colors.backgroundColor
      };
      curDate = curDate.add(1, 'day');
    }

    return Object.assign({}, markedDates);
  }

  get measurements(): Object[] {
    let allTypes = Array.from(this.regimen.getSupportedMeasurementTypes());

    let measurementViewMap = {}
    
    _.forEach<any, any>(allTypes, (type) => {
      measurementViewMap[type] = {
        type: type, 
        required: false,
        selected: false
      }
    });

    _.forEach<any, any>(this.regimen.getTrackedMeasurementTypes(), (type) => {

      if(measurementViewMap[type]) {
        measurementViewMap[type].selected = true
      }
    })

    return Object.values(measurementViewMap);
  }

}

export default RegimenViewModel;