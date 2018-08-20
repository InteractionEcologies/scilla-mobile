// @flow
import {
  UserRoles
} from "../libs/intecojs";

export const fakeState = {
  user: {
    id: '12345',
    firstName: "Jeff",
    lastName: "Huang",
    email: "chuanche@umich.edu",
    role: UserRoles.patient
  },
  regimens: {
    regimens: {
      byId: null,
      editingId: null, 
      activeId: null
    },
    regimenPhases: {
      byId: null,
      activeId: null
    },
    treatments: {
      byId: null
      // TODO: should we organize by date instead? 
    },
    errorMessage: null
  }
}