import { SET_CURRENT_GEOCODE, SET_SELECTED_GEOCODE } from '../types';
import { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from '../persistConfig';
import { PlaceType } from '../../types/google-map-types';

const initialState: {
  currentGeocode: PlaceType[];
  selectedGeocode: PlaceType[];
} = {
  currentGeocode: [],
  selectedGeocode: [],
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
    default:
      return state;
  }
};

export default persistReducer(persistConfig, geocodeReducer);
