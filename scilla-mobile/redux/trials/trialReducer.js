// @flow
import {
  ADD_TRIAL, 
  FETCH_TRIALS_BEGIN,
  FETCH_TRIALS_SUCCESS, 
  FETCH_TRIALS_FAILURE
} from "./trialActions";

const initialState = {
  trials: [],
  loading: false, 
  error: null
};

export default function trialReducer(state: any = initialState, action: any) {
  switch(action.type) {
    case FETCH_TRIALS_BEGIN: 
      return {
        ...state,
        loading: true, 
        error: null
      }
    case FETCH_TRIALS_SUCCESS:
      return {
        ...state,
        loading: false, 
        trials: action.payload.trials
      }
    case FETCH_TRIALS_FAILURE:
      return {
        ...state,
        loading: false, 
        error: action.payload.error,
        trials: []
      }
    default:
      return state
  }
}
