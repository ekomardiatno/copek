import { SimpleLocationType, SessionStateType } from "../reducers/app.reducer";
import { SET_CURRENT_LOCATION, SET_SESSION } from "../types";

export const setSession = (session: SessionStateType | null) => ({
  type: SET_SESSION,
  payload: session,
});

export const setCurrentLocation = (location: SimpleLocationType | null) => ({
  type: SET_CURRENT_LOCATION,
  payload: location
})