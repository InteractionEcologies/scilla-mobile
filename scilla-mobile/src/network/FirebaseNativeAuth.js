/* eslint-disable no-useless-constructor */
// @flow
import { IAuth } from "../libs/scijs";
import firebase from "react-native-firebase";

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
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  }

  signInWithEmailAndPassword(
    email: string, 
    password: string
  ): Promise<any> {
    return firebase
      .auth()
      .signInAndRetrieveDataWithEmailAndPassword(email, password);
  }

  signOut(): Promise<any> {
    return firebase.auth().signOut();
  }

  onAuthStateChanged(
    nextOrObserver: (any) => void | Promise<void>,
    error?: (any) => void,
    completed?: () => void
  ): Promise<any> {
    return firebase.auth().onAuthStateChanged(nextOrObserver, error, completed);
  }

  get currentUser(): any {
    return firebase.auth().currentUser;
  }

}