import { PermissionStatus } from 'react-native';
import { PermissionStatus as PermissionIosStatus } from 'react-native-permissions';
import { SimpleLocationType } from '../reducers/app.reducer';
import {
  SET_CURRENT_GEOLOCATION,
  SET_DESTINATION_LOCATION,
  SET_PERMISSION_ANDROID,
  SET_PERMISSION_IOS,
  SET_SELECTED_LOCATION,
} from '../types';
import { GeolocationResponse } from '@react-native-community/geolocation';

export const setCurrentGeolocation = (location: GeolocationResponse['coords'] | null) => ({
  type: SET_CURRENT_GEOLOCATION,
  payload: location,
});

export const setSelectedLocation = (
  location: SimpleLocationType | null,
) => ({
  type: SET_SELECTED_LOCATION,
  payload: location,
});

export const setDestinationLocation = (
  location: SimpleLocationType | null,
) => ({
  type: SET_DESTINATION_LOCATION,
  payload: location,
});

export const setPermissionAndroid = (state: PermissionStatus | null) => {
  return {
    type: SET_PERMISSION_ANDROID,
    payload: state,
  };
};

export const setPermissionIos = (state: PermissionIosStatus | null) => {
  return {
    type: SET_PERMISSION_IOS,
    payload: state,
  };
};
