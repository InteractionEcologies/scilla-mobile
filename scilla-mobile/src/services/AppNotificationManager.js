// @flow
import type { ReminderConfigObject } from "../libs/scijs";
import { ReminderTypeOptions } from "../libs/scijs";
import { Notifications } from "expo";
import { Platform } from "react-native";
import * as Permissions from "expo-permissions";
import { AlarmTime } from "../libs/scijs";
import AppClock from "./AppClock";

type Notification = {
  origin: string, // "selected" if the notification was tapped on by the user
                  // "received" if the notification was received while the user was in the app. 
  data: Object, 
  remote: boolean,

  userText: ?string, 
  actionId: ?number
}
const appClock = AppClock.instance;

// eslint-disable-next-line no-unused-vars
const SCOPE = "AppNotificationManager:"
/**
 * Should update this along with regimen phase transition. 
 */
export default class AppNotificationManager {
  
  static instance: AppNotificationManager

  static androidChannelId: string = "scilla";
  static categoryOptions = {
    treatment: "treatment",
    dailyEval: "dailyEval"
  };
  static actionOptions = {
    take: {
      actionId: "take",
      buttonTitle: "Take"
    },
    skip: {
      actionId: "skip",
      buttonTitle: "Skip"
    },
    report: {
      actionId: "report",
      buttonTitle: "Report"
    },
    ignore: {
      actionId: "ignore",
      buttonTitle: "Ignore"
    }
  };

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
    
    this.initCategories();
    this.initAndroidChannels();
  }

  async initCategories() {
    await Notifications.createCategoryAsync(
      AppNotificationManager.categoryOptions.treatment, 
      [
        AppNotificationManager.actionOptions.take, 
        AppNotificationManager.actionOptions.skip
      ]
    )

    await Notifications.createCategoryAsync(
      AppNotificationManager.categoryOptions.dailyEval, 
      [
        AppNotificationManager.actionOptions.report, 
        AppNotificationManager.actionOptions.ignore
      ]
    )
  }

  async initAndroidChannels() {
    let channel = {
      name: "Scilla", 
      description: "Scilla's Notifications", 
      sound: true, 
      vibrate: true, 
      badge: false
    }
    
    if (Platform.OS === "android") {
      await Notifications.createChannelAndroidAsync(
        AppNotificationManager.androidChannelId, 
        channel
      )
    }
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
    await Notifications.scheduleLocalNotificationAsync(localNotification, options);
  }

  async setNotificationsByReminderConfigs(configs: ReminderConfigObject[]) {
    
    await this._cancelScheduledNotifications();

    for(let config of configs) {
      config = (config: ReminderConfigObject);

      // removed disabled notifications. 
      if (config.enabled === false) continue;

      let alarmTime = new AlarmTime(config.time, appClock.now());
      let time = alarmTime.toMoment().toDate();
      
      let localNotification: Object = {}			
      let options: Object = {
        time: time, 
        repeat: 'day',
        ios: {
          sound: true
        },
        android: {
          channelId: AppNotificationManager.androidChannelId
        }
      }

			switch (config.type) {
				case ReminderTypeOptions.dailyEval:
						localNotification.title = "Report your symptoms";
            localNotification.body = "Tap to report your symptoms today."
            options.categoryId = AppNotificationManager.categoryOptions.dailyEval;
						break;
				case ReminderTypeOptions.treatment:
            localNotification.title = "Remember to take your medication";
            localNotification.body = "Tap to see medication schedule.";
            options.categoryId = AppNotificationManager.categoryOptions.treatment;
						break;
				default:
						break; 
			} 

      let nid = await Notifications.scheduleLocalNotificationAsync(localNotification, options);
      console.log(SCOPE, "Scheduled notification", nid);
      this.scheduledNotificationIds.push(nid);
    }
    
  }

  async _cancelScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduledNotificationIds = [];
  }
  

}