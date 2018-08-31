// @flow
import AppService from "../AppService";
import { PersistenceTypes } from "../../libs/intecojs";

describe.only("AppService", () => {

  it( "Mock AppService", () => {
    let appService = new AppService();
    
    appService.initialize({
      disableAuth: true
    })
  })
})