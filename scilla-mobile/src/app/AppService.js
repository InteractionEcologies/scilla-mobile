/**
 * A singleton for globally-accessible services 
 */
// @flow
import * as firebase from 'firebase';
import { FirebaseConfig } from "../constants/FirebaseConfig";
import { FirebaseAuth, FirebaseDS, IAuth, IDataSource,
  generatePushIDFunc
} from "../libs/intecojs";
import type { Persistence } from "../libs/intecojs"; 
import _ from "lodash";

type AppServiceConfig = {
  disableAuthPersistence?: boolean
}

export default class AppService {
  static instance: AppService;
  auth: IAuth; 
  ds: IDataSource;
  generatePushID: () => string;

  constructor() {
    if(AppService.instance) {
      return AppService.instance;
    }

    if(!firebase.apps.length) {
      firebase.initializeApp(FirebaseConfig);
    }

    this.generatePushID = generatePushIDFunc();
    AppService.instance = this;
    return this;
  }

  initialize(config: AppServiceConfig = {}) {
    if (config.disableAuthPersistence === true ) {
      this.auth = new FirebaseAuth(false);
    } else {
      this.auth = new FirebaseAuth();
    }
    this.ds = new FirebaseDS();
  }

}
