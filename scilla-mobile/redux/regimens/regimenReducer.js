// @flow
import {
  ADD_TRIAL, 
  FETCH_TRIALS_BEGIN,
  FETCH_TRIALS_SUCCESS, 
  FETCH_TRIALS_FAILURE
} from "./regimenActions";

const initialState = {
  regimens: [],
  loading: false, 
  error: null
};

export default function regimenReducer(state: any = initialState, action: any) {
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
        regimens: action.payload.regimens
      }
    case FETCH_TRIALS_FAILURE:
      return {
        ...state,
        loading: false, 
        error: action.payload.error,
        regimens: []
      }
    default:
      return state
  }
}
