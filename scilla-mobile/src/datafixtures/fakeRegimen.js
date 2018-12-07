// @flow
import type { 
  RegimenObject
} from "../libs/intecojs";
import {
  RegimenTypes,
  RegimenStatusOptions,
  RegimenGoalOptions,
  MeasurementTypes,
  TreatmentDetailOptions
} from "../libs/intecojs"

export const fakeRegimenObject: RegimenObject = {
  id: '-LSLsAx4ALSzzuqc61fF',
  uid: '12345',
  type: RegimenTypes.incBaclofen,
  name: 'Baclofen',
  startDate: '2018-08-20',
  endDate: '2018-09-08', 
  status: RegimenStatusOptions.active,
  regimenParam: {
    currentDoseMg: 0
  },
  regimenGoal: RegimenGoalOptions.baclofen30mg,
  trackedMeasurementTypes: [
    MeasurementTypes.sleepQuality, 
    MeasurementTypes.mood, 
    MeasurementTypes.spasticitySeverity, 
    MeasurementTypes.tiredness
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