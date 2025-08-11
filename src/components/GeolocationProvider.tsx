import { createContext, JSX, useEffect, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import useAppSelector from '../hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import {
  setCurrentGeolocation,
  setPermissionAndroid,
  setPermissionIos,
  setSelectedLocation,
} from '../redux/actions/geolocation.action';

export const GeolocationContext = createContext<{
  permissionGranted: boolean;
  accuracyLevel: 'low' | 'med' | 'high' | 'unknown';
  isGettingCurrentLocation: boolean;
  setIsGettingCurrentLocation: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  permissionGranted: false,
  accuracyLevel: 'unknown',
  isGettingCurrentLocation: true,
  setIsGettingCurrentLocation: () => {},
});

export default function GeolocationProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  const dispatch = useDispatch();
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState<boolean>(false);
  const currentGeolocation = useAppSelector(
    state => state.geolocationReducer.currentGeolocation,
  );
  const permissionAndroid = useAppSelector(
    state => state.geolocationReducer.permissionAndroid,
  );
  const permissionIos = useAppSelector(
    state => state.geolocationReducer.permissionIos,
  );

  useEffect(() => {
    if (!currentGeolocation) {
      setIsGettingCurrentLocation(true);
    }
  }, [currentGeolocation]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const requestPermission = async () => {
        const checkResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        dispatch(setPermissionIos(checkResult));
        if (checkResult === 'blocked') {
          Alert.alert(
            'Izin lokasi dibutuhkan',
            'Nyalain lokasi biar kita bisa cari driver dan merchant terdekat',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => {
                  Linking.openSettings();
                  setIsGettingCurrentLocation(false);
                },
              },
            ],
          );
        } else if (checkResult !== 'granted' && checkResult !== 'unavailable') {
          const requestResult = await request(
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            {
              title: 'Izin lokasi dibutuhkan',
              message:
                'Nyalain lokasi biar kita bisa cari driver dan merchant terdekat.',
              buttonPositive: 'Izinkan',
            },
          );
          if (requestResult === 'denied') {
            requestPermission();
          } else if (requestResult === 'granted') {
            dispatch(setPermissionIos(requestResult));
          }
        }
      };
      if (isGettingCurrentLocation) requestPermission();
    }
  }, [isGettingCurrentLocation, dispatch]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const requestPermission = async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === 'never_ask_again') {
          Alert.alert(
            'Izin lokasi dibutuhkan',
            'Nyalain lokasi biar kita bisa cari driver dan merchant terdekat',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => {
                  Linking.openSettings();
                  setIsGettingCurrentLocation(false);
                },
              },
            ],
          );
        }
        dispatch(setPermissionAndroid(granted));
      };
      if (isGettingCurrentLocation) requestPermission();
    }
  }, [isGettingCurrentLocation, dispatch]);

  useEffect(() => {
    if (permissionAndroid !== null || permissionIos !== null) {
      if (
        isGettingCurrentLocation &&
        (permissionAndroid === 'granted' || permissionIos === 'granted')
      ) {
        Geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          dispatch(setCurrentGeolocation(pos.coords))
          dispatch(setSelectedLocation({ latitude, longitude }));
          setIsGettingCurrentLocation(false);
        });
      } else if (
        isGettingCurrentLocation &&
        !(permissionAndroid === 'granted' || permissionIos === 'granted')
      ) {
        setIsGettingCurrentLocation(false);
      }
    }
  }, [
    permissionAndroid,
    permissionIos,
    isGettingCurrentLocation,
    dispatch,
  ]);

  useEffect(() => {
    if (currentGeolocation?.accuracy && currentGeolocation.accuracy >= 100) {
      Alert.alert(
        'Akurasi Lokasi Rendah',
        `Akurasi lokasi kamu cuma sekitar ${Math.round(
          currentGeolocation.accuracy,
        )} meter nih. 
Coba nyalain GPS atau pindah ke area yang lebih terbuka.`,
        [
          {
            text: 'Ulangi',
            onPress: () => {
              setIsGettingCurrentLocation(true);
            },
          },
        ],
      );
    }
  }, [currentGeolocation, dispatch]);

  return (
    <GeolocationContext.Provider
      value={{
        isGettingCurrentLocation,
        setIsGettingCurrentLocation,
        permissionGranted:
          permissionAndroid === 'granted' || permissionIos === 'granted',
        accuracyLevel:
          currentGeolocation?.accuracy ? currentGeolocation.accuracy <= 20
              ? 'high'
              : currentGeolocation.accuracy <= 100
              ? 'med'
              : 'low'
            : 'unknown',
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}
