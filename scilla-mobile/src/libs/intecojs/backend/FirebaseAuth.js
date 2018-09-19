// @flow
import { IAuth } from "../index";
import firebase from "firebase";

export type Persistence = $npm$firebase$auth$Auth$Persistence$Enum;
export const PersistenceTypes = firebase.auth.Auth.Persistence;

export class FirebaseAuth implements IAuth {
  constructor(
    persistence: boolean = true
  ) {
    if(persistence) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    }
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
      .signInWithEmailAndPassword(email, password)
      .then( (user) => {
        
      });
  }

  signOut(): Promise<any> {
    
    return firebase
      .auth()
      .signOut();
  }

  onAuthStateChanged(
    nextOrObserver: (any) => void | Promise<void>,
    error?: (any) => void,
    completed?: () => void
  ) {
    firebase.auth().onAuthStateChanged(nextOrObserver, error, completed);
  }

  get currentUser(): any {
    return firebase.auth().currentUser;
  }
}