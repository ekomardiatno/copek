/* eslint-disable react-native/no-inline-styles */
import { JSX, useCallback, useContext, useEffect, useState } from 'react';
import SimpleHeader from '../components/SimpleHeader';
import {
  Alert, Linking,
  PermissionsAndroid,
  PermissionStatus, Text, TouchableOpacity,
  View
} from 'react-native';
import { themeColors } from '../constants';
import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setCurrentLocation, setSession } from '../redux/actions/app.action';
import Menu from '../components/homeComponents/Menu';
import Geolocation from '@react-native-community/geolocation';
import Icon from '../components/Icon';
import {
  SimpleLocationType
} from '../redux/reducers/app.reducer';
import { CurrentGeocodeLocationContext } from '../components/CurrentGeocodeLocationProvider';
import useCustomNavigation from '../hooks/useCustomNavigation';
import useAppSelector from '../hooks/useAppSelector';

export default function HomeScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useCustomNavigation();
  const [permissionAndroid, setPermissionAndroid] =
    useState<PermissionStatus | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(true);
  const location = useAppSelector<SimpleLocationType | null>(
    state => state.appReducer.currentLocation,
  );
  const setLocation = useCallback((pos: SimpleLocationType) => {
    dispatch(setCurrentLocation(pos));
  }, [dispatch]);
  const {currentGeocodeLocation: geocode} = useContext(CurrentGeocodeLocationContext);
  const route = geocode.find(r => r.types?.find(a => a === 'route'));

  useEffect(() => {
    const requestPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      setPermissionAndroid(granted);
    };
    if (isGettingLocation) requestPermission();
  }, [isGettingLocation]);

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
        setLocation({ latitude, longitude });
      });
    }
    setIsGettingLocation(false);
  }, [permissionAndroid, setLocation]);

  const handleLogout = () => {
    dispatch(setSession(null));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Login' as never,
        },
      ],
    });
  };

  return (
    <>
      <SimpleHeader />
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            backgroundColor: themeColors.white,
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.grayLight,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            COPEK
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
                borderWidth: 1,
                borderColor: themeColors.borderColorGray,
                borderRadius: 100,
                paddingVertical: 5,
                paddingHorizontal: 5,
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="location-dot"
                  color={themeColors.textColor}
                  size={14}
                />
              </View>
              <Text
                style={{
                  color: themeColors.black,
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              >
                {route && route.formatted_address
                  ? route.formatted_address.split(',')[0].trim()
                  : `${location?.latitude}, ${location?.longitude}`}
              </Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <View
                style={{
                  height: 38,
                  width: 38,
                  borderRadius: 38,
                  borderWidth: 1,
                  borderColor: themeColors.borderColorGray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: themeColors.white,
                }}
              >
                <Icon name="user" color={themeColors.textColor} size={18} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 30,
            paddingVertical: 20,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Menu
              title="Ride"
              size={140}
              iconName="motorcycle"
              onPress={() => {}}
              color={themeColors.green}
              disabled={location === null || isGettingLocation}
            />
            <Menu
              title="Food"
              size={140}
              iconName="utensils"
              onPress={() => {
                navigation.navigate('Food');
              }}
              color={themeColors.red}
              disabled={location === null || isGettingLocation}
            />
          </View>
        </View>
      </View>
    </>
  );
}
