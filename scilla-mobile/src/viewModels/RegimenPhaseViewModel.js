// @flow
import type { IRegimenPhase } from "../libs/scijs";
import { RegimenUtils, PartOfDayOptions } from "../libs/scijs";

export default class RegimenPhaseViewModel  {

  phase: IRegimenPhase

  constructor(regimenPhase: IRegimenPhase) {
    this.phase = regimenPhase;
  }

  getThreePillTableViewValues(): string[] {
    let valuesForPillTableRow: string[] = [" ", " ", " "];
    let treatmentsByPartOfDayObject = this.phase.getTreatmentsByPartOfDay();
    let podOptions = [
      PartOfDayOptions.morning, 
      PartOfDayOptions.afternoon, 
      PartOfDayOptions.evening
    ]
    for(let podOption of podOptions) {
      let treatments = treatmentsByPartOfDayObject[podOption];
      let oneTreatment = treatments ? treatments[0]: null;

      let arrayIndex = RegimenUtils.partOfDay2ArrayIndex(podOption);
      valuesForPillTableRow[arrayIndex] = 
        oneTreatment 
        ? oneTreatment.getShortDescription()
        : " ";
    }
    return valuesForPillTableRow;
  }
}