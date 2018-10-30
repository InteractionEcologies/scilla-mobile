// @flow
import firebase from "firebase";

export interface IAuth {
  // prefix with + to make it read-only.
  +currentUser: any;  // can be null if no signed-in user. 
  createUserWithEmailAndPassword(email: string, password: string): Promise<any>;
  signInWithEmailAndPassword(email: string, password: string): Promise<any>;
  signOut(): Promise<any>;

  /**
   * @param  {(any)=> void | Promise<void>} nextOrObserver The callback will receive a user object. 
   * @param  {any} error?
   * @param  {any} completed?
   * @returns void
   */
  onAuthStateChanged(
    nextOrObserver: (any) => void | Promise<void>, 
    error?: (any) => void, 
    completed?: () => void
  ): void;
}