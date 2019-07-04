// @flow
import AppService from "../../services/AppService";
const appService = new AppService();

export const ADD_TRIAL = "ADD_TRIAL";
export const FETCH_TRIALS_BEGIN = "FETCH_TRIALS_BEGIN";
export const FETCH_TRIALS_SUCCESS = "FETCH_TRIALS_SUCCESS";
export const FETCH_TRIALS_FAILURE = "FETCH_TRIALS_FAILURE";

export const REGIMEN_CREATE = "REGIMEN/CREATE";
export const REGIMEN_SET_PARAM = "REGIMEN/SET_PARAM";
export const REGIMEN_GENERATE_GOAL = "REGIMEN/GENERATE_GOAL";
export const REGIMEN_SET_START_DATE = "REGIMEN/SET_START_DATE";
export const REGIMEN_ADD_MEASUREMENT_TYPE = "REGIMEN/ADD_MEASUREMENT_TYPE";
export const REGIMEN_REMOVE_MEASUREMENT_TYPE = "REGIMEN/REMOVE_MEASUREMENT_TYPE";
export const REGIMEN_FINALIZE = "REGIMEN/FINALIZE";

// export const CREATE_REGIMEN = "CREATE_REGIMEN";
// export const SET_REGIMEN_PARAM = "SET_REGIMEN_PARAM";
// export const ADD_REGIMEN_MEASUREMENT_TYPE = "ADD_REGIMEN_MEASUREMENT_TYPE";
// export const REMOVE_REGIMEN_MEASUREMENT_TYPE = "REMOVE_REGIMEN_MEASUREMENT_TYPE";


/**
 * Action Creators
 */
type Action = {
  type: string
}

type ActionCreator = (dispatch: any) => 
  void | Promise<void> | Action | Promise<Action>;


export function initRegimen(): ActionCreator {
  return (dispatch: any, getState: any) => {
    // initialize a regimen? 
    const { userId } = getState();

  }
}

export function getRegimens(): ActionCreator {
  return (dispatch: any) => {
    let uid = appService.auth.currentUser.uid;
    return appService.ds.getRegimens(uid)
      .then( (regimens) => {
        dispatch(getRegimensSuccess(regimens));
      })
  }
  // return (dispatch: any) => {
  //   dispatch(getRegimensBegin());
  //   return 
  // }
}

export function getRegimensBegin(): Action {
  return {
    type: FETCH_TRIALS_BEGIN
  }
}

export function getRegimensSuccess(regimens: any): Action {
  return {
    type: FETCH_TRIALS_SUCCESS,
    payload: { regimens }
  }
}

export function getRegimensFailure(error: any): Action {
  return {
    type: FETCH_TRIALS_FAILURE,
    payload: { error }
  }
}
