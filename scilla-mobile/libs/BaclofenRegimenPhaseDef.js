// @flow
import {
  TreatmentDetailOptions, TreatmentOptions, 
} from "./intecojs/types";

import type {
  TreatmentObject
} from "./intecojs/types";

export const BaclofenRegimenPhaseDef: {
  "slots": any, 
  "5mg": TreatmentObject[],
  "10mg": TreatmentObject[],
  "15mg": TreatmentObject[],
  "20mg": TreatmentObject[],
  "25mg": TreatmentObject[],
  "30mg": TreatmentObject[],
  "35mg": TreatmentObject[],
  "40mg": TreatmentObject[],
  "45mg": TreatmentObject[],
  "50mg": TreatmentObject[],
  "55mg": TreatmentObject[],
  "60mg": TreatmentObject[]
} = {
  "slots": [
    {
      id: "0", 
      order: 0,
      timeDesc: "morning", 
      defaultTime: "08:00",
      actionType: TreatmentOptions.baclofen
    },
    {
      id: "1", 
      order: 1, 
      timeDesc: "afternoon",
      defaultTime: "12:00",
      actionType: TreatmentOptions.baclofen, 
    },
    {
      id: "2", 
      order: 2,
      timeDesc: "evening",
      defaultTime: "18:00",
      actionType: TreatmentOptions.baclofen
    }
  ],
  "5mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen5mg
    }
  ],
  "10mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen5mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen5mg
    }
  ],
  "15mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen5mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen5mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen5mg
    }
  ],
  "20mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen10mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen5mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen5mg
    }
  ],
  "25mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen10mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen10mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen5mg
    }
  ],
  "30mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen10mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen10mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen10mg
    }
  ],
  "35mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen15mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen10mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen10mg
    }
  ],
  "40mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen15mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen15mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen10mg
    }
  ],
  "45mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen15mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen15mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen15mg
    }
  ],
  "50mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen20mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen15mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen15mg
    }
  ],
  "55mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen20mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen20mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen15mg
    }
  ],
  "60mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      option: TreatmentDetailOptions.baclofen20mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      option: TreatmentDetailOptions.baclofen20mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      option: TreatmentDetailOptions.baclofen20mg
    }
  ]
}