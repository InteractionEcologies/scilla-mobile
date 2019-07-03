// @flow
import AppService from "./AppService";
import AppStore from './AppStore';
import moment from "moment";
import { ScreenNames } from "../constants/Screens";
import NavigationService from "../navigation/NavigationService";
import { IRegimen } from "../libs/scijs";
import AppClock from "./AppClock";

const SCOPE = "AppInitializer";

// Handle init tasks and foreground/background transitions. More like an 
// AppDelegate. 
export default class AppInitializer {

  static instance: AppInitializer

  // Singletons. 
  appStore = new AppStore();
  appService = new AppService(); // this will init ds and auth services. 
  appClock = new AppClock();

  constructor() {
    if(!AppInitializer.instance) {
      AppInitializer.instance = this;
    }

    this.setup();
    return AppInitializer.instance;
  }

  setup = () => { 
    // Much call initialize to use appService. 
    // This will initialize the subservices (ds and auth). 
    // We use a initialize to take in configuration, 
    // as currently there is not way to define constructor interface. 
    this.appService.initialize();

    // 
    this.appClock.setCurrentDatetime(moment("2019-07-08"));
  }

  /**
   * When the app first stated, it won't call onEnterForeground. 
   */
  onAppStart = async () => {
    console.log(SCOPE, "onAppStart");
    await this._updateRegimenPhaseIfNeeded();
    await this._showPhaseTransitionDialogueIfNeeded();
  }

  onEnterForeground = async () => {
    console.log(SCOPE, "enter foreground");
    await this._updateRegimenPhaseIfNeeded();
    await this._showPhaseTransitionDialogueIfNeeded();
  }

  // Tasks 
  _showPhaseTransitionDialogueIfNeeded = async () => {
    let now = this.appClock.now();
    let regimen: IRegimen = await this.appStore.getLatestRegimen();
    let shouldRequest = regimen.shouldRequestPhaseChangePermission(now);
    console.log(SCOPE, "should request phase shift permission:", shouldRequest);
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
      }  
    } catch (e) {
      console.log(e);
    }
  }

}