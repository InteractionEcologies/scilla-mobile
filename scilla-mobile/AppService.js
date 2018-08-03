/**
 * A singleton for globally-accessible services 
 */
// @flow
import * as firebase from 'firebase';
import FirebaseAuth from "./libs/intecojs/FirebaseAuth";
import FirebaseConfig from "./constants/FirebaseConfig";

import { IAuth } from './libs/intecojs/IAuth';


class AppService {
  static instance: AppService;
  auth: IAuth; 

  constructor() {
    if(AppService.instance) {
      return AppService.instance;
    }

    firebase.initializeApp(FirebaseConfig);
    this.auth = new FirebaseAuth();
    AppService.instance = this;
    return this;
  }

}

export default new AppService();