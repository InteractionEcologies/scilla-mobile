/**
 * A singleton for globally-accessible services 
 */
// @flow
import * as firebase from 'firebase';
import { FirebaseConfig } from "../constants/FirebaseConfig";
import { FirebaseAuth, FirebaseDS, IAuth, IDataSource } from "../libs/intecojs";
import { generatePushIDFunc } from "../libs/intecojs";

class AppService {
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

    this.auth = new FirebaseAuth();
    this.ds = new FirebaseDS();
    this.generatePushID = generatePushIDFunc();
    AppService.instance = this;
    return this;
  }


}

export default new AppService();