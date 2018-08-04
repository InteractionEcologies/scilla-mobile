import { combineReducers } from "redux";
import trialReducer from "./trials/trialReducer";

const rootReducer = combineReducers({
  trialReducer,
})

export default rootReducer; 