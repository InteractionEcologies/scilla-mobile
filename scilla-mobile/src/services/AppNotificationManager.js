// @flow
import type { ReminderConfigObject } from "../libs/scijs";
import { ReminderTypeOptions } from "../libs/scijs";
import * as Notifications from 'expo-notifications';
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
    Notifications.addNotificationReceivedListener(
      this.didReceiveNotification
    );
    // TODO: Add logging to capture if users responded to notifications.
    // Notifications.addNotificationResponseReceivedListene();
    
    this.initAndroidChannels();
  }

  async initAndroidChannels() {
    let channel: Notifications.NotificationChannelInput = {
      name: "Scilla", 
      importance: Notifications.AndroidImportance.MAX,
      description: "Scilla's Notifications", 
      sound: true, 
      vibrate: true, 
      badge: false
    }
    
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        AppNotificationManager.androidChannelId, 
        channel
      )
    }
  }

  didReceiveNotification(notification: Notification) {
    console.log(SCOPE, "didReceiveNotification", notification);
  }

  async requestPermission() {
    // const { status, permissions } = await Permissions
    //   .askAsync(Permissions.USER_FACING_NOTIFICATIONS);

    //   if (status === 'granted') {
    //     console.log(status);
    //     return 
    //   } else {
    //     throw new Error("Notification permission not granted.")
    //   }
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true, 
        allowBadge: true, 
        allowSound: true, 
      }
    })
  }

  async getPermission() {
    const { status } = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    return status;
  }

  async sendImmediately() {
    console.log("Send a notification");
    await Notifications.presentNotificationAsync({
      title: "test", 
      body: "test"
    })
  }

  async sendWithDelaySec(sec: number) {
    const content = {
      title: "Remember to take your medication",
      body: "Remember to take your medication."
    }
    const trigger = {
      seconds: sec,
      repeats: false
    }
    await Notifications.scheduleNotificationAsync({
      content: content, 
      trigger: trigger
    });
  }

  async setNotificationsByReminderConfigs(configs: ReminderConfigObject[]) {
    
    await this._cancelScheduledNotifications();
    console.log(SCOPE, "ReminderConfigs", configs);

    for(let config of configs) {
      config = (config: ReminderConfigObject);

      // removed disabled notifications. 
      if (config.enabled === false) continue;

      let alarmTime: AlarmTime = new AlarmTime(config.time, appClock.now());
      let time = alarmTime.toMoment().toDate();
      
      let content: Notifications.NotificationContent = {}			
      let trigger: Notifications.DailyNotificationTrigger = {
        type: "daily",
        hour: alarmTime.hour,
        minute: alarmTime.minute
      }

			switch (config.type) {
				case ReminderTypeOptions.dailyEval:
          content.title = "Report your symptoms";
          content.body = "Tap to report your symptoms today."
          break;
				case ReminderTypeOptions.treatment:
          content.title = "Remember to take your medication";
          content.body = "Tap to see medication schedule.";
          break;
				default:
          break; 
			} 

      try {
        let nid = await Notifications.scheduleNotificationAsync(
          {
            content: content, 
            trigger: trigger
          }
        );
        console.log(SCOPE, "Scheduled notification", nid);
        this.scheduledNotificationIds.push(nid);
      } catch (err) {
        console.warn(err)
      }
    }
    
  }

  async _cancelScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduledNotificationIds = [];
  }
  

}