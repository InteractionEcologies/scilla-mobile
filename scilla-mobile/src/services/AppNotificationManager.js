// @flow
import type { ReminderConfigObject } from "../libs/scijs";
import { Notifications, Permissions } from "expo";
import { AlarmTime } from "../libs/scijs";
import AppClock from "./AppClock";

type Notification = {
  origin: string, 
  data: Object, 
  remote: boolean,

  userText: ?string, 
  actionId: ?number
}
const appClock = AppClock.instance;

const SCOPE = "AppNotificationManager."
/**
 * Should update this along with regimen phase transition. 
 */
export default class AppNotificationManager {
  
  static instance: AppNotificationManager
  scheduledNotificationIds: number[] = []
  
  constructor() {
    if(!AppNotificationManager.instance) {
      AppNotificationManager.instance = this;

      // Perform init here. 
      this.setup();
      return AppNotificationManager.instance;
    }

    return AppNotificationManager.instance;
  }

  setup() {
    Notifications.addListener(this.didReceiveNotification);
  }

  didReceiveNotification(notification: Notification) {
    console.log(SCOPE, "didReceiveNotification", notification);
  }

  async requestPermission() {
    const { status, permissions } = await Permissions
      .askAsync(Permissions.USER_FACING_NOTIFICATIONS);

      if (status === 'granted') {
        console.log(status);
        return 
      } else {
        throw new Error("Notification permission not granted.")
      }
  }

  async getPermission() {
    const { status } = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    return status;
  }

  async sendImmediately() {
    console.log("Send a notification");
    await Notifications.presentLocalNotificationAsync({
      title: "test", 
      body: "test"
    })
  }

  async sendWithDelaySec(sec: number) {
    const localNotification = {
      title: "Remember to take your medication",
      body: "Remember to take your medication."
    }
    const options = {
      time: (new Date()).getTime() + (sec * 1000)
    }
    let nid = await Notifications.scheduleLocalNotificationAsync(localNotification, options);
  }

  async setNotificationsByReminderConfigs(configs: ReminderConfigObject[]) {
    
    await this._cancelScheduledNotifications();

    for(let config of configs) {
      config = (config: ReminderConfigObject)
      let alarmTime = new AlarmTime(config.time, appClock.now());
      let time = alarmTime.toMoment().toDate();
      
      const localNotification = {
        title: "Remember to take your medication",
        body: "Remember to take your medication."
      }
      const options = {
        time: time, 
        repeat: 'day'
      }

      let nid = await Notifications.scheduleLocalNotificationAsync(localNotification, options);
      this.scheduledNotificationIds.push(nid);
    }
    
  }

  async _cancelScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduledNotificationIds = [];
  }
  

}