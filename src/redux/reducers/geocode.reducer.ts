import { SET_CURRENT_GEOCODE, SET_DESTINATION_GEOCODE, SET_DESTINATION_PLACE_INFO, SET_SELECTED_GEOCODE, SET_SELECTED_PLACE_INFO } from '../types';
import { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from '../persistConfig';
import { PlaceType } from '../../types/google-map-types';

export type SimplePlaceInfoType = {
    placeName: '',
    routeName: ''
  }

const initialState: {
  currentGeocode: PlaceType[];
  selectedGeocode: PlaceType[];
  destinationGeocode: PlaceType[];
  selectedPlaceInfo: SimplePlaceInfoType | null
  destinationPlaceInfo: SimplePlaceInfoType | null
} = {
  currentGeocode: [],
  selectedGeocode: [],
  destinationGeocode: [],
  selectedPlaceInfo: null,
  destinationPlaceInfo: null
};

const geocodeReducer = (state = initialState, action: PayloadAction<any>) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CURRENT_GEOCODE:
      return {
        ...state,
        currentGeocode: payload as PlaceType[],
      };
    case SET_SELECTED_GEOCODE:
      return {
        ...state,
        selectedGeocode: payload as PlaceType[],
      };
    case SET_DESTINATION_GEOCODE:
      return {
        ...state,
        destinationGeocode: payload as PlaceType[],
      };
    case SET_SELECTED_PLACE_INFO:
      return {
        ...state,
        selectedPlaceInfo: payload as SimplePlaceInfoType | null,
      };
    case SET_DESTINATION_PLACE_INFO:
      return {
        ...state,
        destinationPlaceInfo: payload as SimplePlaceInfoType | null,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, geocodeReducer);
