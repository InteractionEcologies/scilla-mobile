// @flow
import { Regimen } from "../models/regimen";
import type { 
  TreatmentComplianceReport 
} from "../libs/intecojs";

class AppState {
  user: any; // TODO: change any to more specific user type. 

  regimensById: Map<string, Regimen> = new Map();
  activeRegimenId: ?string = null;

  complianceReportsById: Map<string, TreatmentComplianceReport> = new Map();
  complianceReportsByDate: Map<string, TreatmentComplianceReport[]> = new Map();

  static instance: AppState

  constructor() {
    if(!AppState.instance) {
      AppState.instance = this;
    } 

    return AppState.instance;
  }

  hasRegimens = (): boolean => {
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

export default new AppState();
