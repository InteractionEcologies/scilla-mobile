// @flow
import appService from "../../AppService";

export const ADD_TRIAL = "ADD_TRIAL";
export const FETCH_TRIALS_BEGIN = "FETCH_TRIALS_BEGIN";
export const FETCH_TRIALS_SUCCESS = "FETCH_TRIALS_SUCCESS";
export const FETCH_TRIALS_FAILURE = "FETCH_TRIALS_FAILURE";

/**
 * Action Creators
 */
export function fetchRegimens() {
  return (dispatch: any) => {
    let uid = appService.auth.currentUser.uid;
    return appService.ds.fetchRegimens(uid)
      .then( (regimens) => {
        dispatch(fetchRegimensSuccess(regimens));
      })
  }
  // return (dispatch: any) => {
  //   dispatch(fetchRegimensBegin());
  //   return 
  // }
}

export const fetchRegimensBegin = () => ({
  type: FETCH_TRIALS_BEGIN
})

export const fetchRegimensSuccess = (regimens: any) => ({
  type: FETCH_TRIALS_SUCCESS,
  payload: { regimens }
})

export const fetchRegimensFailure = (error: any) => ({
  type: FETCH_TRIALS_FAILURE,
  payload: { error }
})
