import { combineReducers } from "redux"

import appReducer from "./app.reducer"
import cartReducer from "./cart.reducer"

const rootReducer = combineReducers({
  appReducer,
  cartReducer
})

export default rootReducer