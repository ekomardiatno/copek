import { SET_ACCURACY, SET_CURRENT_GEOLOCATION, SET_PERMISSION_ANDROID, SET_PERMISSION_IOS, SET_SELECTED_GEOLOCATION } from '../types';
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
  accuracy: number,
} = {
  currentGeolocation: null,
  selectedLocation: null,
  permissionAndroid: null,
  permissionIos: null,
  accuracy: -1,
};

const geolocationReducer = (state = initialState, action: PayloadAction<any>) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CURRENT_GEOLOCATION:
      return {
        ...state,
        currentGeolocation: payload as GeolocationResponse['coords'] | null,
      };
    case SET_SELECTED_GEOLOCATION:
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
    case SET_ACCURACY:
      return {
        ...state,
        SET_ACCURACY: payload as number,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, geolocationReducer);
