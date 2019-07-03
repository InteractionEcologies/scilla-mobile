// @flow
import moment from "moment";

export default class AppClock {
  // positive number means we are 
  // simulating a future time 

  static instance: AppClock 
  offsetMs: number = 0

  constructor() {
    if(!AppClock.instance) {
      AppClock.instance = this;
    }

    return AppClock.instance;
  }

  setCurrentDatetime(dt: moment) {
    this.offsetMs = dt.clone().diff(moment());
  }

  now(): moment {
    console.log("now", this.offsetMs);
    let now = moment().add(this.offsetMs, "milliseconds");
    console.log(now)
    return now;
  }
}