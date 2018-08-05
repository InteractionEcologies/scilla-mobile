// @flow
import {
  TreatmentTypes
} from "./intecojs/types";

export const BaclofenTreatmentDef = {
  "5mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "10mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen5mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "15mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen5mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen5mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "20mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen10mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen5mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "25mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen10mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen10mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen5mg
    }
  ],
  "30mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen10mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen10mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen10mg
    }
  ],
  "35mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen15mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen10mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen10mg
    }
  ],
  "40mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen15mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen15mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen10mg
    }
  ],
  "45mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen15mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen15mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen15mg
    }
  ],
  "50mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen20mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen15mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen15mg
    }
  ],
  "55mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen20mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen20mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen15mg
    }
  ],
  "60mg": [
    {
      time: '08:00',
      timeDesc: 'morning',
      type: TreatmentTypes.baclofen20mg
    },
    {
      time: '12:00',
      timeDesc: 'afternoon',
      type: TreatmentTypes.baclofen20mg
    },
    {
      time: '18:00',
      timeDesc: 'evening',
      type: TreatmentTypes.baclofen20mg
    }
  ]
}