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
import type { AppServiceConfig } from "./IAppService";
import { IAppService } from "./IAppService";
import { AppServiceImplWithFirebaseWeb } from "./AppServiceImplWithFirebaseWeb";
import { AppServiceImplWithFirebaseNative} from "./AppServiceImplWithFirebaseNative"

/* An AppService factory that returns an AppServiceImpl 
 * (i.e., AppServiceImplementation). This allows us to 
 * easily swap different app service implementations. 
 */
export default class AppService {
  static instance: IAppService;

  constructor() {
    if(AppService.instance) {
      return AppService.instance
    }

    // AppService.instance = new AppServiceImplWithFirebaseWeb();
    AppService.instance = new AppServiceImplWithFirebaseNative();
    return AppService.instance;
  }
}

// export default class AppService {
//   static instance: AppService;
//   auth: IAuth; 
//   ds: IDataSource;
//   generatePushID: () => string;

//   constructor() {
//     if(AppService.instance) {
//       return AppService.instance;
//     }

//     if(!firebase.apps.length) {
//       firebase.initializeApp(FirebaseConfig);
//     }

//     this.generatePushID = generatePushIDFunc();
//     AppService.instance = this;
//     return this;
//   }

//   initialize(config: AppServiceConfig = {}) {
//     if (config.disableAuthPersistence === true ) {
//       this.auth = new FirebaseAuth(false);
//     } else {
//       this.auth = new FirebaseAuth();
//     }
//     this.ds = new FirebaseDS();
//   }

// }
