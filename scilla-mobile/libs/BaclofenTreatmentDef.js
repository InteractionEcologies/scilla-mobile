// @flow
import {
  TreatmentTypes, ActionTypes
} from "./intecojs/types";

export const BaclofenTreatmentDef = {
  "slots": [
    {
      id: "0", 
      order: 0,
      timeDesc: "morning", 
      defaultTime: "08:00",
      actionType: ActionTypes.baclofen
    },
    {
      id: "1", 
      order: 1, 
      timeDesc: "afternoon",
      defaultTime: "12:00",
      actionType: ActionTypes.baclofen, 
    },
    {
      id: "2", 
      order: 2,
      timeDesc: "evening",
      defaultTime: "18:00",
      actionType: ActionTypes.baclofen
    }
  ],
  "5mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "10mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen5mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "15mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen5mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen5mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "20mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen10mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen5mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "25mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen10mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen10mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "30mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen10mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen10mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen10mg
    }
  ],
  "35mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen15mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen10mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen10mg
    }
  ],
  "40mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen15mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen15mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen10mg
    }
  ],
  "45mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen15mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen15mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen15mg
    }
  ],
  "50mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen20mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen15mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen15mg
    }
  ],
  "55mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen20mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen20mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen15mg
    }
  ],
  "60mg": [
    {
      slotId: "0",
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen20mg
    },
    {
      slotId: "1",
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen20mg
    },
    {
      slotId: "2",
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen20mg
    }
  ]
}