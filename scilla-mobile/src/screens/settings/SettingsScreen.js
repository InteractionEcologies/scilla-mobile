// @flow
import React from 'react';
import {
  View, StyleSheet, ScrollView
} from 'react-native';
import { 
  Button, 
} from "native-base";
import {
  AppText
} from "../../components";
import { Styles as AppStyles } from "../../constants/Styles";

// import { ExpoConfigView } from '@expo/samples';
// import Auth from "../libs/Auth";
import AppService from "../../services/AppService";
import AppStore from "../../services/AppStore";
import { AlarmTime, IRegimen } from '../../libs/scijs';
import AppClock from "../../services/AppClock";
import AppNotificationManager from "../../services/AppNotificationManager";

const appService = new AppService();
const appStore = AppStore.instance;
const appClock = AppClock.instance;
const appNotiManager = AppNotificationManager.instance;

const SCOPE = "SettingsScreen";
export default class SettingsScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: 'Settings',
  };

  constructor(props: any) {
    super(props);
  }

  signOut = () => {
    appService.auth.signOut()
      .then( () => this.props.navigation.navigate("Auth") );
  }

  // Debug use
  notifyDiary = async () => {
    let regimen: IRegimen = await appStore.getLatestRegimen();
    console.log(SCOPE, regimen.reminderConfigs);

    let configs = regimen.reminderConfigs;
    
    // clone the config object. 
    let dailyEvalConfig = Object.assign({}, configs[3]);
    dailyEvalConfig.time = "17:26"
    console.log(SCOPE, "Ready to schedule notification", dailyEvalConfig);
    await appNotiManager.setNotificationsByReminderConfigs([dailyEvalConfig]);
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    // return <ExpoConfigView />;
    return (

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[AppStyles.contentBody, styles.contentBody]}>
            <Button onPress={this.signOut} block>
              <AppText>Sign Out</AppText>
            </Button>

            {/* ======== Debug use =========== */}
            {/* <Button onPress={this.notifyDiary} block>
              <AppText>Create Diary Notification</AppText>
            </Button> */}
          </View>
        </ScrollView>

    )
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1, 
    width: '100%', 
    paddingRight: 10, 
    paddingLeft: 10
  },
  contentBody: {
  
  }
})