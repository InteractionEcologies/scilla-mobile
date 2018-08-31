// @flow
import { Regimen } from "../models/regimen";
import type { 
  ComplianceReportObject
} from "../libs/intecojs";
import AppService from "./AppService";

export default class AppState {
  user: any; // TODO: change any to more specific user type. 

  appService = new AppService();

  regimensById: Map<string, Regimen> = new Map();
  activeRegimenId: ?string = null;

  complianceReportsById: Map<string, ComplianceReportObject> = new Map();
  complianceReportsByDate: Map<string, ComplianceReportObject[]> = new Map();

  static instance: AppState

  constructor() {
    if(!AppState.instance) {
      AppState.instance = this;
    } 

    return AppState.instance;
  }

  initialize(): Promise<void> {
    // TODO: work on this.
    return Promise.resolve();
  }

  getRegimens(): Promise<Regimen[]> {
    // this.appService.ds.ge

    return Promise.resolve([]);
  }

  hasRegimens(): boolean {
    if(this.regimensById.size > 0) {
      return true;
    } else {
      return false;
    }
  }

  getActiveRegimen(): Regimen | null {
    if(this.activeRegimenId) {
      let regimen = this.regimensById.get(this.activeRegimenId);
      if(regimen) {
        return regimen
      }
    }
    return null
  }
}

