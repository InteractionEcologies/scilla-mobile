// @flow
import firebase from "@react-native-firebase/app";
// import '@react-native-firebase/analytics';

export default class UsageLogger {
  static instance: UsageLogger;

  logger: any; 

  constructor() {
    if (!UsageLogger.instance) {

      // this.logger = firebase.analytics();

      UsageLogger.instance = this;
    }
    
    return UsageLogger.instance;
  }

  logEvent(event: string, params: ?Object = null) {
    // console.log("logEvent", event);
    // if(params) {
    //   this.logger.logEvent(event, params);
    // } else {
    //   this.logger.logEvent(event);
    // }
  }

  setUserId(id: string) {
    // this.logger.setUserId(id);
  }
}

export const UsageEvents = {
  sign_up: "sign_up",
  login: "login",

  screen_view: "custom_screen_view",

  redeem_begin: "custom_redeem_begin",
  redeem_complete: "custom_redeem_complete",

  // View the medication plan for a specific day
  view_medication: "view_medication",

  report_mem: "report_memo",
  report_daily_begin: "report_daily_begin",
  report_daily_complete: 'report_daily_complete'
}