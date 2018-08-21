import { combineReducers } from "redux";
import regimenReducer from "./regimens/regimenReducer";

const rootReducer = combineReducers({
  regimenReducer,
})

export default rootReducer; 