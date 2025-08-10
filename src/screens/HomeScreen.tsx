/* eslint-disable react-native/no-inline-styles */
import { JSX, useContext } from 'react';
import SimpleHeader from '../components/SimpleHeader';
import { Text, View } from 'react-native';
import { themeColors } from '../constants';
import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setSession } from '../redux/actions/app.action';
import Menu from '../components/homeComponents/Menu';
import Icon from '../components/Icon';
import { GeocodeContext } from '../components/GeocodeProvider';
import useAppNavigation from '../hooks/useAppNavigation';
import Pressable from '../components/Pressable';
import { GeolocationContext } from '../components/GeolocationProvider';

export default function HomeScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useAppNavigation();
  const {isGettingCurrentLocation, currentLocation} = useContext(GeolocationContext)
  const {currentGeocode: geocode} = useContext(GeocodeContext);
  const route = geocode.find(r => r.types?.find(a => a === 'route'));

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
                  : `${currentLocation?.latitude}, ${currentLocation?.longitude}`}
              </Text>
            </View>
            <Pressable onPress={handleLogout}>
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
            </Pressable>
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
              disabled={currentLocation === null || isGettingCurrentLocation}
            />
            <Menu
              title="Food"
              size={140}
              iconName="utensils"
              onPress={() => {
                navigation.navigate('Food');
              }}
              color={themeColors.red}
              disabled={currentLocation === null || isGettingCurrentLocation}
            />
          </View>
        </View>
      </View>
    </>
  );
}
