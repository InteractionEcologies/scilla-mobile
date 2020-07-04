// @flow
import AppService from "./AppService";
import AppStore from './AppStore';
import { ScreenNames } from "../constants/Screens";
import NavigationService from "../navigation/NavigationService";
import { IRegimen } from "../libs/scijs";
import AppClock from "./AppClock";
import AppNotificationManager from "./AppNotificationManager";
import UsageLogger from "./UsageLogger";

const SCOPE = "AppInitializer:";

/** Handle init tasks and foreground/background transitions. 
 *  Provide callbacks at important places of the app, such as
 *  when the main screen is loaded, when the main regimen screen is loaded. 
 */
export default class AppInitializer {

  static instance: AppInitializer

  // Singletons. 
  appService = new AppService(); // this will init ds and auth services. 
  appStore = new AppStore();
  appClock = new AppClock();
  appNotiManager = new AppNotificationManager();
  logger = new UsageLogger();

  constructor() {
    if(!AppInitializer.instance) {
      AppInitializer.instance = this;
      this.setup();
    }

    return AppInitializer.instance;
  }

  setup = () => { 
    console.log(SCOPE, "setup");
    // Must call initialize to use appService. 
    // This will initialize the subservices (ds and auth). 
    // We use an initialize method to take in configuration, 
    // as currently there is not way to define constructor interface. 
    this.appService.initialize();

    // Simulate time
    // this.appClock.setCurrentDatetime(moment("2019-07-18"));
  }

  /**
   * When the app first started, it won't call onEnterForeground. 
   */
  onAppStart = async () => {
    console.log(SCOPE, "onAppStart");
  }

  /**
   * Will be called once Dashboard screen is loaded. 
   */
  onMainScreenLoaded = async () => {
    this.logger.setUserId(this.appStore.uid);

    console.log(SCOPE, "onMainScreenLoaded")
    try {
      await this.appNotiManager.requestPermission();
    } catch (e) {
      console.log(e);
    }

    // testing
    let status = await this.appNotiManager.getPermission();
    if(status === "granted") {
      // await this.appNotiManager.sendImmediately();
      // await this.appNotiManager.sendWithDelaySec(5);
      // let configs = [{
      //   id: '0',  
      //   reminderSlotId: '0',
      //   type: 'treatment',
      //   time: '10:39', 
      //   timeConstraint: 'morning',
      //   order: 0, 
      //   treatmentDetailOption: 'baclofen',
      //   enabled: true
      // }]
      // await this.appNotiManager.setNotificationsByReminderConfigs(configs);
    }
    await this.updateRegimenPhaseAndRequestPermission();
  
  }

  onEnterForeground = async () => {
    console.log(SCOPE, "enter foreground");
    await this.updateRegimenPhaseAndRequestPermission();
  }

  onRegimenRedeemed = async () =>  {
    console.log(SCOPE, "onRegimenRedeemed");
    // FIXME: should set a subscriber for latest regimen in 
    // AppStore rather than manually calling cache reset. 
    this.appStore.resetRegimenCache();
    await this.appStore.getLatestRegimen()
    this.appStore.observeComplianceReports();
  }

  /**
   * Called whenever the regimen main screen is loaded. 
   * This is used when a new regimen is redeemed, we should 
   * immediately 
   */
  onRegimenMainScreenLoaded = async () => {
    console.log(SCOPE, "onRegimenMainScreenLoaded");
    await this.updateRegimenPhaseAndRequestPermission();
  }


  // Tasks 
  updateRegimenPhaseAndRequestPermission = async () => {
    try {
      await this._updateRegimenPhaseIfNeeded();
      await this._showPhaseTransitionDialogueIfNeeded();
    } catch(e) {
      // ignore;
      console.log(e);
    }
  }
  _showPhaseTransitionDialogueIfNeeded = async () => {
    let now = this.appClock.now();
    let regimen: IRegimen = await this.appStore.getLatestRegimen();
    let shouldRequest = regimen.shouldRequestPhaseChangePermission(now);
    // console.log(SCOPE, "should request phase shift permission:", shouldRequest);
    if(shouldRequest) {
      console.log(SCOPE, "Navigate to phase transition");
      NavigationService.navigate(ScreenNames.RegimenPhaseTransition);
    }
  }

  /**
   * User will grant permission through a dialogue to the next phase. 
   * When the next phase comes, `reigmen.updatePhase()` needs to be called
   * to switch the active phase to the next date. 
   */
  _updateRegimenPhaseIfNeeded = async () => {
    let now = this.appClock.now();
    try {
      let regimen: IRegimen = await this.appStore.getLatestRegimen();
      if(regimen.updatePhase(now)) {
        this.appStore.updateRegimen(regimen);
        
        let reminderConfigs = regimen.getActiveReminderConfigs();
        // console.log(SCOPE, "update reminder conigs", reminderConfigs);
        this.appNotiManager.setNotificationsByReminderConfigs(reminderConfigs);
      }  
    } catch (e) {
      console.log(e);
    }
  }

}