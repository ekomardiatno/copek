import { combineReducers } from "redux"

import appReducer from "./app.reducer"

const rootReducer = combineReducers({
  appReducer,
})

export default rootReducer