import { PlaceType } from "../../types/google-map-types";
import { SET_CURRENT_GEOCODE, SET_SELECTED_GEOCODE } from "../types";

export const setCurrentGeocode = (location: PlaceType[]) => ({
  type: SET_CURRENT_GEOCODE,
  payload: location,
});

export const setSelectedGeocode = (location: PlaceType[]) => ({
  type: SET_SELECTED_GEOCODE,
  payload: location,
});