// @flow
import AppService from "./AppService";
import AppStore from './AppStore';
import moment from "moment";
import { ScreenNames } from "../constants/Screens";
import NavigationService from "../navigation/NavigationService";

const SCOPE = "AppInitializer";

// Handle init tasks and foreground/background transitions. More like an 
// AppDelegate. 
export default class AppInitializer {

  static instance: AppInitializer

  // Singletons. 
  appStore = new AppStore();
  appService = new AppService(); // this will init ds and auth services. 

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
  }

  onAppStart = async () => {
    console.log(SCOPE, "onAppStart");
    
  }

  onEnterForeground = async () => {
    console.log(SCOPE, "enter foreground");
    if(this.appStore.hasActiveRegimen()
      && this.appStore.shouldCheckRegimenPhaseUpdate()) {
      this._updateRegimenPhase();
    }
  }

  // Tasks 
  _updateRegimenPhase = async () => {
     // user has signed in 
    console.log("Should check if we need to update regimen phase");
    let regimen = await this.appStore.getLatestRegimen();
    if(regimen.checkAndUpdatePhase()) {
      this.appStore.updateRegimen(regimen);
    }

    let shouldRequest = regimen.shouldRequestPhaseChangePermission(moment());
    console.log(SCOPE, "should request phase shift permission:", shouldRequest);
    if(shouldRequest) {
      console.log(SCOPE, "Navigate to phase transition");
      NavigationService.navigate(ScreenNames.RegimenPhaseTransition);
    }
  }

}