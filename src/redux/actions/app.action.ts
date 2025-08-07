import { CurrentGeocodeLocationStateType, CurrentLocationStateType, SessionStateType } from "../reducers/app.reducer";
import { SET_CURRENT_GEOCODE_LOCATION, SET_CURRENT_LOCATION, SET_SESSION } from "../types"

export const setSession = (session: SessionStateType | null) => ({
  type: SET_SESSION,
  payload: session,
});

export const setCurrentLocation = (location: CurrentLocationStateType | null) => ({
  type: SET_CURRENT_LOCATION,
  payload: location
})

export const setCurrentGeocodeLocation = (geocode: CurrentGeocodeLocationStateType) => ({
  type: SET_CURRENT_GEOCODE_LOCATION,
  payload: geocode
})