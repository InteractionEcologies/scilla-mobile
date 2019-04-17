// @flow
import type {
  RegimenType,
  RegimenObject
} from "../../libs/intecojs";
import {
  RegimenTypes
} from "../../libs/intecojs";
import { IncBaclofenRegimen  } from "./IncBaclofenRegimen"; 
import { Regimen} from "./Regimen";
import { DecBaclofenRegimen } from "./DecBaclofenRegimen";

export class RegimenFactory {
  static createRegimen(type: RegimenType): Regimen {
    switch(type) {
      case RegimenTypes.incBaclofen:
        return new IncBaclofenRegimen();
      case RegimenTypes.decBaclofen:
        return new DecBaclofenRegimen();
      default:
        throw TypeError("No such regimen type exists");
    }
  }

  static createRegimenFromObj(obj: RegimenObject): Regimen {
    let regimen = RegimenFactory.createRegimen(obj.type);
    regimen.updateFromObj(obj);
    return regimen;
  }

}
