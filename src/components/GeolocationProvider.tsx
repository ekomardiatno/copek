import { createContext, JSX, useEffect, useState } from 'react';
import { SimpleLocationType } from '../redux/reducers/app.reducer';
import { Alert, Linking, PermissionsAndroid, PermissionStatus } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const GeolocationContext = createContext<{
  currentLocation: SimpleLocationType | null;
  selectedLocation: SimpleLocationType | null;
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<SimpleLocationType | null>
  >;
  isGettingCurrentLocation: boolean,
  setIsGettingCurrentLocation: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}>({
  currentLocation: null,
  selectedLocation: null,
  setSelectedLocation: () => {},
  isGettingCurrentLocation: true,
  setIsGettingCurrentLocation: () => {}
});

export default function GeolocationProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  const [currentLocation, setCurrentLocation] =
    useState<SimpleLocationType | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<SimpleLocationType | null>(null);
  const [permissionAndroid, setPermissionAndroid] =
    useState<PermissionStatus | null>(null);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(true);

  useEffect(() => {
    const requestPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      setPermissionAndroid(granted);
    };
    if (isGettingCurrentLocation) requestPermission();
  }, [isGettingCurrentLocation]);

  useEffect(() => {
    if (permissionAndroid === 'never_ask_again') {
      Alert.alert(
        'Location Permission Required',
        'This app requires location permission to function properly. Please enable it in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
      );
    } else if (permissionAndroid === 'granted') {
      Geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation({ latitude, longitude });
        setSelectedLocation({ latitude, longitude })
      });
    }
    setIsGettingCurrentLocation(false);
  }, [permissionAndroid]);

  return (
    <GeolocationContext.Provider
      value={{ currentLocation, selectedLocation, setSelectedLocation, isGettingCurrentLocation, setIsGettingCurrentLocation }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}
