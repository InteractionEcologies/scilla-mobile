// @flow
import * as firebase from 'firebase';
import { FirebaseConfig } from "../constants/FirebaseConfig";
import { FirebaseAuth, FirebaseDS, IAuth, IDataSource,
  generatePushIDFunc
} from "../libs/intecojs";
import type { Persistence } from "../libs/intecojs"; 
import { IAppService } from "./IAppService";
import type { AppServiceConfig } from "./IAppService";

export class AppServiceImplWithFirebaseWeb implements IAppService {
  static instance: AppServiceImplWithFirebaseWeb;
  auth: IAuth;
  ds: IDataSource;
  generatePushID: () => string;

  constructor() {
    if(AppServiceImplWithFirebaseWeb.instance) {
      return AppServiceImplWithFirebaseWeb.instance;
    }
    
    if(!firebase.apps.length) {
      firebase.initializeApp(FirebaseConfig);
    }

    this.generatePushID = generatePushIDFunc();
    
    AppServiceImplWithFirebaseWeb.instance = this;
    return this;
  }

  initialize(config: AppServiceConfig = {}) {
    if (config.disableAuthPersistence === true ) {
      this.auth = new FirebaseAuth(false);
    } else {
      this.auth = new FirebaseAuth();
    }
    this.ds = new FirebaseDS(firebase.firestore());
  }
}