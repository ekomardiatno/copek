import { combineReducers } from "redux"

import appReducer from "./app.reducer"
import cartReducer from "./cart.reducer"
import geolocationReducer from "./geolocation.reducer"
import geocodeReducer from "./geocode.reducer"

const rootReducer = combineReducers({
  appReducer,
  cartReducer,
  geolocationReducer,
  geocodeReducer
})

export default rootReducer