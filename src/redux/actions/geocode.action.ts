import { PlaceType } from "../../types/google-map-types";
import { SimplePlaceInfoType } from "../reducers/geocode.reducer";
import { SET_CURRENT_GEOCODE, SET_DESTINATION_GEOCODE, SET_DESTINATION_PLACE_INFO, SET_SELECTED_GEOCODE, SET_SELECTED_PLACE_INFO } from "../types";

export const setCurrentGeocode = (location: PlaceType[]) => ({
  type: SET_CURRENT_GEOCODE,
  payload: location,
});

export const setSelectedGeocode = (location: PlaceType[]) => ({
  type: SET_SELECTED_GEOCODE,
  payload: location,
});

export const setDestinationGeocode = (location: PlaceType[]) => ({
  type: SET_DESTINATION_GEOCODE,
  payload: location,
});

export const setSelectedPlaceInfo = (location: SimplePlaceInfoType | null) => ({
  type: SET_SELECTED_PLACE_INFO,
  payload: location,
});

export const setDestinationPlaceInfo = (location: SimplePlaceInfoType | null) => ({
  type: SET_DESTINATION_PLACE_INFO,
  payload: location,
});