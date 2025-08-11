import { SET_CURRENT_GEOLOCATION, SET_DESTINATION_LOCATION, SET_PERMISSION_ANDROID, SET_PERMISSION_IOS, SET_SELECTED_LOCATION } from '../types';
import { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from '../persistConfig';
import { SimpleLocationType } from './app.reducer';
import { PermissionStatus } from 'react-native';
import { PermissionStatus as PermissionIosStatus } from 'react-native-permissions';
import { GeolocationResponse } from '@react-native-community/geolocation';

const initialState: {
  currentGeolocation: GeolocationResponse['coords'] | null;
  selectedLocation: SimpleLocationType | null;
  permissionAndroid: PermissionStatus | null;
  permissionIos: PermissionIosStatus | null
  destinationLocation: SimpleLocationType | null,
  savedDestinationLocations: SimpleLocationType[]
} = {
  currentGeolocation: null,
  selectedLocation: null,
  destinationLocation: null,
  permissionAndroid: null,
  permissionIos: null,
  savedDestinationLocations: []
};

const geolocationReducer = (state = initialState, action: PayloadAction<any>) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CURRENT_GEOLOCATION:
      return {
        ...state,
        currentGeolocation: payload as GeolocationResponse['coords'] | null,
      };
    case SET_SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: payload as SimpleLocationType | null,
      };
    case SET_PERMISSION_ANDROID:
      return {
        ...state,
        permissionAndroid: payload as PermissionStatus | null,
      };
    case SET_PERMISSION_IOS:
      return {
        ...state,
        permissionIos: payload as PermissionIosStatus | null,
      };
    case SET_DESTINATION_LOCATION:
      return {
        ...state,
        destinationLocation: payload as SimpleLocationType | null,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, geolocationReducer);
