import firebase from "firebase";

export default class Auth {
  static async createUserWithEmailAndPassword(email, password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  }

  static async signOut() {
    // console.log("signOut");
    return firebase
      .auth()
      .signOut();
  }
}