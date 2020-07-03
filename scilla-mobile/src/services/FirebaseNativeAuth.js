/* eslint-disable no-useless-constructor */
// @flow
import { IAuth } from "../libs/scijs";
import auth from "@react-native-firebase/auth";

export class FirebaseNativeAuth implements IAuth {
  constructor(
    persistence: boolean = true
  ) {
    // setPersistence is not supported in React Native Firebase. 
  }

  createUserWithEmailAndPassword(
    email: string, 
    password: string
  ): Promise<any> {
    return auth()
      .createUserWithEmailAndPassword(email, password);
  }

  signInWithEmailAndPassword(
    email: string, 
    password: string
  ): Promise<any> {
    return auth()
      .signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<any> {
    return auth().signOut();
  }

  onAuthStateChanged(
    nextOrObserver: (any) => void | Promise<void>,
    error?: (any) => void,
    completed?: () => void
  ): Promise<any> {
    return auth().onAuthStateChanged(nextOrObserver, error, completed);
  }

  get currentUser(): any {
    return auth().currentUser;
  }

}