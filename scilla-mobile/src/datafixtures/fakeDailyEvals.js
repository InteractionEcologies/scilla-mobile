// @flow
import { fakeUserProfile } from "./core";
import type
{
  DailyEvaluationObject
} from "../libs/intecojs";

export const fakeDailyEvals: DailyEvaluationObject[] = [
  {
    id: 'adjisoajdiosaffxv-1', 
    uid: fakeUserProfile.uid,
    date: '2018-11-01',
    createdAtTimestamp: 1541068072,
    measurementsByType: {
      "Sleep Quality": 1,
      "Spasticity Severity": 2,
      "Baclofen Amount": 5,
      "Tiredness": 5,
      "Mood": 5,
    
      // For daily eval only
      "Exercise Time": 30,
      "Memo": "I'm OK today",
      
      "Botox": false,
      "Trigger Point Injection": false,
      "Accupuncture": false,
      "Physical Therapy": false
    }
  },
  {
    id: 'adjisoajdiosaffxv-2', 
    uid: fakeUserProfile.uid,
    date: '2018-11-02',
    createdAtTimestamp: 1541154472,
    measurementsByType: {
      "Sleep Quality": 3,
      "Spasticity Severity": 4,
      "Baclofen Amount": 5,
      "Tiredness": 3,
      "Mood": 3,
    
      // For daily eval only
      "Exercise Time": 30,
      "Memo": "I'm OK today",
      
      "Botox": false,
      "Trigger Point Injection": false,
      "Accupuncture": false,
      "Physical Therapy": false
    }
  },
  {
    id: 'adjisoajdiosaffxv-3', 
    uid: fakeUserProfile.uid,
    date: '2018-11-03',
    createdAtTimestamp: 1541240872,
    measurementsByType: {
      "Sleep Quality": 1,
      "Spasticity Severity": 2,
      "Baclofen Amount": 10,
      "Tiredness": 5,
      "Mood": 5,
    
      // For daily eval only
      "Exercise Time": 30,
      "Memo": "I'm OK today",
      
      "Botox": false,
      "Trigger Point Injection": false,
      "Accupuncture": false,
      "Physical Therapy": false
    }
  },
  {
    id: 'adjisoajdiosaffxv-4', 
    uid: fakeUserProfile.uid,
    date: '2018-11-04',
    createdAtTimestamp: 1541327272,
    measurementsByType: {
      "Sleep Quality": 3,
      "Spasticity Severity": 4,
      "Baclofen Amount": 10,
      "Tiredness": 3,
      "Mood": 3,
    
      // For daily eval only
      "Exercise Time": 0,
      "Memo": "I'm OK today",
      
      "Botox": true,
      "Trigger Point Injection": false,
      "Accupuncture": false,
      "Physical Therapy": false
    }
  }
]