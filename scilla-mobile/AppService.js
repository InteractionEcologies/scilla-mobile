/**
 * A singleton for globally-accessible services 
 */
// @flow
import * as firebase from 'firebase';
import FirebaseAuth from "./libs/intecojs/backend/FirebaseAuth";
import FirebaseConfig from "./constants/FirebaseConfig";
import FirebaseDS from "./libs/intecojs/backend/FirebaseDS";
import { IAuth } from './libs/intecojs/backend/IAuth';
import { IDataSource } from "./libs/intecojs/backend/IDataSource";


class AppService {
  static instance: AppService;
  auth: IAuth; 
  ds: IDataSource;

  constructor() {
    if(AppService.instance) {
      return AppService.instance;
    }

    if(!firebase.apps.length) {
      firebase.initializeApp(FirebaseConfig);
    }

    this.auth = new FirebaseAuth();
    this.ds = new FirebaseDS();
    AppService.instance = this;
    return this;
  }


}

export default new AppService();