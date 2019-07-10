// @flow
import { IAppService } from "./IAppService";
import type { AppServiceConfig } from "./IAppService";
import { FirebaseDS, IAuth, IDataSource,
  generatePushIDFunc
} from "../libs/scijs";
import {  FirebaseNativeAuth } from "./FirebaseNativeAuth";

import firebase from "react-native-firebase";

const SCOPE = "AppServiceImplWithFirebaseNative:"
export class AppServiceImplWithFirebaseNative implements IAppService {
  static instance: AppServiceImplWithFirebaseNative;
  auth: IAuth;
  ds: IDataSource;
  generatePushID: () => string;

  constructor() {
    if(AppServiceImplWithFirebaseNative.instance) {
      return AppServiceImplWithFirebaseNative.instance;
    }

    this.generatePushID = generatePushIDFunc();
    
    AppServiceImplWithFirebaseNative.instance = this;
    return this;
  }

  initialize(config: AppServiceConfig = {}) {
    console.log(SCOPE, "initialize")
    this.auth = new FirebaseNativeAuth();
    firebase.firestore().settings({
      persistence: true
    });
    this.ds = new FirebaseDS(firebase.firestore());
  }
}