import { SET_CURRENT_GEOCODE_LOCATION, SET_CURRENT_LOCATION, SET_SESSION } from '../types';
import { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from '../persistConfig';
import { PlaceType } from '../../types/google-map-types';

export type SessionStateType = {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
};

export type CurrentLocationStateType = {
  latitude: number;
  longitude: number;
};

export type CurrentGeocodeLocationStateType = PlaceType[];

const initialState: {
  session: SessionStateType | null;
  currentLocation: CurrentLocationStateType | null;
  currentGeocodeLocation: CurrentGeocodeLocationStateType;
} = {
  session: null,
  currentLocation: null,
  currentGeocodeLocation: [],
};

const appReducer = (
  state = initialState,
  action: PayloadAction<any>,
) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SESSION:
      return {
        ...state,
        session: payload,
      };
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: payload,
      };
    case SET_CURRENT_GEOCODE_LOCATION:
      return {
        ...state,
        currentGeocodeLocation: payload,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, appReducer);
