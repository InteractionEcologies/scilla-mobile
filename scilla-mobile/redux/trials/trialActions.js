// @flow
import appService from "../../AppService";

export const ADD_TRIAL = "ADD_TRIAL";
export const FETCH_TRIALS_BEGIN = "FETCH_TRIALS_BEGIN";
export const FETCH_TRIALS_SUCCESS = "FETCH_TRIALS_SUCCESS";
export const FETCH_TRIALS_FAILURE = "FETCH_TRIALS_FAILURE";


/**
 * Action Creators
 */
export function fetchTrials() {
  return (dispatch: any) => {
    let uid = appService.auth.currentUser.uid;
    return appService.ds.fetchTrials(uid)
      .then( (trials) => {
        dispatch(fetchTrialsSuccess(trials));
      })
  }
  // return (dispatch: any) => {
  //   dispatch(fetchTrialsBegin());
  //   return 
  // }
}

export const fetchTrialsBegin = () => ({
  type: FETCH_TRIALS_BEGIN
})

export const fetchTrialsSuccess = (trials: any) => ({
  type: FETCH_TRIALS_SUCCESS,
  payload: { trials }
})

export const fetchTrialsFailure = (error: any) => ({
  type: FETCH_TRIALS_FAILURE,
  payload: { error }
})