// @flow
import type { 
  RegimenObject
} from "../libs/scijs";
import {
  RegimenTypes,
  RegimenStatusOptions,
  MeasurementTypes,
  TreatmentDetailOptions
} from "../libs/scijs"

export const fakeRegimenObject: RegimenObject = {
  id: '-LSLsAx4ALSzzuqc61fF',
  
  redeemCode: '1234', 
  clinicianName: "Mark Newman",
  createdForUserFullname: "Jeff Huang",
  prescribedData: '2019-06-18',
  createdByEmail: 'chuanche@umich.edu',
  createdAt: 1561056862,

  uid: '12345',
  type: RegimenTypes.genericBaclofen,
  name: 'Baclofen',
  startDate: '2019-06-20',
  endDate: '2019-07-08', 

  status: RegimenStatusOptions.notRedeemed,
  regimenParam: {
    startDosageMg: 0,
    maxDosageMg: 30, 
    incrementMg: 5, 
    phaseLengthDays: 7
  },
  regimenGoal: 30,
  trackedMeasurementTypes: [
    MeasurementTypes.spasticitySeverity, 
    MeasurementTypes.weakness, 
    MeasurementTypes.sleepiness
  ],
  regimenPhases: [
    {
      phase: 0, 
      startDate: '2018-08-20',
      endDate: '2018-08-26',
      treatments: [
        {
          id: '1',
          reminderSlotId: "0",
          time: '08:00',
          timeDesc: 'morning',
          option: TreatmentDetailOptions.baclofen5mg
        }
      ]
    }, 
    {
      phase: 1, 
      startDate: '2018-08-27',
      endDate: '2018-09-02',
      treatments: [
        {
          id: '2',
          reminderSlotId: "0",
          time: '08:00',
          timeDesc: 'morning',
          option: TreatmentDetailOptions.baclofen5mg
        },
        {
          id: '3',
          reminderSlotId: "1",
          time: '18:00',
          timeDesc: 'evening',
          option: TreatmentDetailOptions.baclofen5mg
        }
      ]
    },
    {
      phase: 2, 
      startDate: '2018-09-02',
      endDate: '2018-09-08',
      treatments: [
        {
          id: '4',
          reminderSlotId: "0",
          time: '08:00',
          timeDesc: 'morning',
          option: TreatmentDetailOptions.baclofen5mg
        },
        {
          id: '5',
          reminderSlotId: "1",
          time: '12:00',
          timeDesc: 'afternoon',
          option: TreatmentDetailOptions.baclofen5mg
        },
        {
          id: '6',
          reminderSlotId: "2",
          time: '18:00',
          timeDesc: 'evening',
          option: TreatmentDetailOptions.baclofen5mg
        }
      ]
    }
  ],
  reminderConfigs: [

  ]

  
}