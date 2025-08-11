/* eslint-disable react-native/no-inline-styles */
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, Image, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { LATITUDE_DELTA, LONGITUDE_DELTA, ROUNDED_SIZE, themeColors } from '../constants';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Pressable from '../components/Pressable';
import Icon from '../components/Icon';
import useAppNavigation from '../hooks/useAppNavigation';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Spinner from '../components/Spinner';
import { SimpleLocationType } from '../redux/reducers/app.reducer';
import { PlaceType } from '../types/google-map-types';
import { generateCityAndRouteName } from '../utils';
import Button from '../components/Button';
import { FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import Input from '../components/Input';
import Geolocation from '@react-native-community/geolocation';
import useAppSelector from '../hooks/useAppSelector';
import ErrorBase from '../components/ErrorBase';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '../redux/actions/geolocation.action';
import { getGeocode, searchPlace } from '../services/google-services';
import LoadingBase from '../components/LoadingBase';
import parsingError from '../utils/parsingError';
import InfiniteScroll from '../components/InfiniteScroll';

const CustomButton = ({
  onPress,
  icon,
  iconColor,
  children,
}: {
  onPress?: (event: GestureResponderEvent) => void;
  icon?: FontAwesome6SolidIconName;
  iconColor?: string;
  children: string;
}): JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      viewStyle={{
        backgroundColor: themeColors.grayLighter,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: ROUNDED_SIZE,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon && <Icon name={icon} size={11} color={iconColor} />}
        <Text style={{ fontSize: 13, fontWeight: '300' }}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default function SelectLocationScreen(): JSX.Element {
  const mapRef = useRef<MapView>(null);
  const { selectedLocation, currentGeolocation } = useAppSelector(
    state => state.geolocationReducer,
  );
  const dispatch = useDispatch();
  const selectedGeocode = useAppSelector(
    state => state.geocodeReducer.selectedGeocode,
  );
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const [locationMarker, setLocationMarker] =
    useState<SimpleLocationType | null>(null);
  const [geocodeMarker, setGeocodeMarker] = useState<PlaceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<Error | TypeError | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const translateXMarker = useSharedValue(0);
  const frame = useSafeAreaFrame();
  const [showMap, setShowMap] = useState(true);
  const [hidePlaceInfo, setHidePlaceInfo] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (isGettingCurrentLocation) {
      Geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        setLocationMarker({ latitude, longitude });
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
        setIsGettingCurrentLocation(false);
      });
    }
  }, [isGettingCurrentLocation]);

  const heightContainerPlaceInfo = useSharedValue(264);
  const opacityPlaceInfo = useSharedValue(1);
  const opacitySearchResultWrapper = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        opacityPlaceInfo.value,
        [1, 0],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });
  const opacityMapViewContainer = useSharedValue(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<PlaceType[]>([]);
  const [searchError, setSearchError] = useState<Error | TypeError | null>(
    null,
  );
  const [pageToken, setPageToken] = useState<string | null>('');

  const timeoutSearch = useRef<NodeJS.Timeout | null>(null);
  const handleSearchQueryChanged = () => {
    if (timeoutSearch.current) clearTimeout(timeoutSearch.current);
    timeoutSearch.current = setTimeout(() => {
      setIsSearching(true);
      setSearchResult([]);
      setPageToken(null);
      setTimeout(() => {
        setIsSearching(false);
      }, 1000);
    }, 800);
  };

  const abortController = useRef<AbortController | null>(null);
  useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current?.abort();
    };
  }, []);

  const fetchPlace = useCallback(
    async (signal?: AbortSignal) => {
      if (!isSearching || !searchQuery) return;
      setSearchError(null);
      try {
        const result = await searchPlace(
          {
            location: currentGeolocation
              ? {
                  longitude: currentGeolocation.longitude,
                  latitude: currentGeolocation.latitude,
                }
              : undefined,
            query: searchQuery,
            pageToken: pageToken || undefined,
          },
          signal,
        );
        console.log(
          {
            location: currentGeolocation
              ? {
                  longitude: currentGeolocation.longitude,
                  latitude: currentGeolocation.latitude,
                }
              : undefined,
            query: searchQuery,
            pageToken: pageToken,
          },
          result,
        );
        if (result.status !== 'OK' && result.status !== 'ZERO_RESULTS') {
          setPageToken(null);
          throw new Error('Failed to find place');
        }
        if (!pageToken) {
          setSearchResult(result.results);
        } else {
          setSearchResult(prev => [...prev, ...result.results]);
        }
        if (result.next_page_token) {
          setPageToken(result.next_page_token);
        } else {
          setPageToken(null);
        }
      } catch (e) {
        const parsedError = parsingError(e, 'Failed to find place');
        setSearchError(parsedError);
      } finally {
        setIsSearching(false);
      }
    },
    [isSearching, searchQuery, pageToken, currentGeolocation],
  );

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

  useEffect(() => {
    if (showMap) {
      setHidePlaceInfo(false);
      heightContainerPlaceInfo.value = withSpring(264);
      opacityPlaceInfo.value = withSpring(1, {
        duration: 300,
      });
    } else {
      heightContainerPlaceInfo.value = withSpring(
        frame.height - insets.top - 20,
      );
      opacityPlaceInfo.value = withSpring(0, {
        duration: 200,
      });
      setTimeout(() => {
        setHidePlaceInfo(true);
      }, 200);
    }
  }, [
    frame.height,
    heightContainerPlaceInfo,
    insets.top,
    opacityPlaceInfo,
    showMap,
  ]);

  useEffect(() => {
    if (selectedLocation) {
      opacityMapViewContainer.value = withSpring(1);
    }
  }, [opacityMapViewContainer, selectedLocation]);

  const fetchGeocode = useCallback(
    async (signal?: AbortSignal) => {
      if (!isLoading) return;
      if (!locationMarker) return;
      setRequestError(null);
      try {
        const response = await getGeocode(locationMarker, signal);
        setGeocodeMarker(response);
      } catch (e) {
        if (e instanceof Error || e instanceof TypeError) {
          setRequestError(e);
        } else {
          setRequestError(new Error('Failed to get geocode'));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, locationMarker],
  );

  useEffect(() => {
    const signal = abortController.current?.signal;
    fetchGeocode(signal);
  }, [fetchGeocode]);

  const placeName = useMemo(() => {
    const geocode = geocodeMarker.length < 1 ? selectedGeocode : geocodeMarker;
    const address = geocode?.find(r =>
      r.types?.includes('administrative_area_level_4'),
    )?.address_components;
    let poi = geocode?.find(r =>
      r.types?.includes('point_of_interest'),
    )?.address_components;
    if (poi && poi.find(r => r.types.includes('point_of_interest'))?.short_name)
      return poi.find(r => r.types.includes('point_of_interest'))?.short_name;
    return address ? address[0].short_name : '-';
  }, [geocodeMarker, selectedGeocode]);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
        position: 'relative',
      }}
    >
      <View
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: themeColors.grayLight,
        }}
      >
        <Animated.View style={{ flex: 1, opacity: opacityMapViewContainer }}>
          {(selectedLocation || locationMarker) && (
            <MapView
              ref={mapRef}
              provider="google"
              style={{ width: '100%', height: '100%', position: 'relative' }}
              initialRegion={{
                latitude:
                  locationMarker?.latitude || selectedLocation?.latitude || 0,
                longitude:
                  locationMarker?.longitude || selectedLocation?.longitude || 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              onRegionChangeStart={() => {
                translateXMarker.value = withSpring(-10);
                setIsDragging(true);
              }}
              onRegionChangeComplete={e => {
                if (isMapReady) {
                  translateXMarker.value = withSpring(0);
                  setIsDragging(false);
                  setIsLoading(true);
                  setLocationMarker({
                    latitude: e.latitude,
                    longitude: e.longitude,
                  });
                } else {
                  setIsMapReady(true);
                }
              }}
              mapPadding={{ bottom: 20, right: 10, left: 10, top: 10 }}
            />
          )}
          {!showMap && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
            />
          )}
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                backgroundColor: themeColors.primary,
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: [{ translateX: '-50%' }],
                marginBottom: -1,
                elevation: 5,
              }}
            />
            <Animated.View
              style={{ transform: [{ translateY: translateXMarker }] }}
            >
              <Image
                source={require('../assets/images/icons/passenger-marker.png')}
                style={{ width: 40, height: 40, marginTop: -31 }}
              />
            </Animated.View>

            {isLoading && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: -31,
                  left: '50%',
                  transform: [
                    { translateX: '-50%' },
                    { translateY: translateXMarker },
                  ],
                }}
              >
                <Spinner color={themeColors.white} size={27} />
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </View>
      <View style={{ height: 264 - insets.bottom - 20 }} />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom,
          zIndex: 10,
          backgroundColor: themeColors.white,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: heightContainerPlaceInfo,
        }}
      >
        <View style={{ padding: 20, flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 5,
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}
            >
              <Pressable
                viewStyle={{
                  width: 40,
                  height: 40,
                  backgroundColor: themeColors.white,
                  borderRadius: ROUNDED_SIZE,
                  left: -13,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={isLoading || isDragging}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Icon name="chevron-left" size={15} />
              </Pressable>
              <Text
                style={{ fontWeight: 'bold', fontSize: 18, marginLeft: -13 }}
              >
                Pilih lokasi
              </Text>
            </View>
            {!hidePlaceInfo && (
              <Animated.View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  opacity: opacityPlaceInfo,
                }}
              >
                <CustomButton
                  onPress={() => {
                    setShowMap(false);
                  }}
                  icon="magnifying-glass"
                  iconColor={themeColors.yellow}
                >
                  Cari lokasi
                </CustomButton>
              </Animated.View>
            )}
          </View>
          <View>
            <View
              style={{
                marginTop: 15,
                paddingBottom: 10,
                borderBottomWidth: hidePlaceInfo ? 1 : 0,
                borderBottomColor: themeColors.borderColor,
                marginHorizontal: -20,
                paddingHorizontal: 20,
              }}
            >
              <Input
                styleTextInput={{ paddingVertical: 12 }}
                iconStyle={{ paddingVertical: 12, marginRight: 12 }}
                placeholder="Cari lokasi"
                iconName="circle-dot"
                iconColor={themeColors.blue}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onChange={handleSearchQueryChanged}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}
              >
                <CustomButton
                  icon="location-arrow"
                  iconColor={themeColors.red}
                  onPress={() => {
                    setIsGettingCurrentLocation(true);
                    setShowMap(true);
                  }}
                >
                  Lokasimu saat ini
                </CustomButton>
                <CustomButton
                  onPress={() => {
                    setShowMap(true);
                  }}
                  icon="map-location"
                  iconColor={themeColors.green}
                >
                  Pilih di map
                </CustomButton>
              </View>
            </View>
            {!hidePlaceInfo && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: themeColors.white,
                  bottom: 1,
                  opacity: opacityPlaceInfo,
                }}
              >
                {requestError ? (
                  <ErrorBase
                    mode="horizontal"
                    error={requestError}
                    onReload={() => setIsLoading(true)}
                  />
                ) : (
                  <View style={{ flexDirection: 'row', gap: 15 }}>
                    <Icon
                      name="circle-dot"
                      color={themeColors.blue}
                      size={30}
                      style={{ marginTop: 8 }}
                    />
                    <View>
                      <Text
                        style={{
                          marginTop: 6,
                          fontWeight: '600',
                          fontSize: 16,
                        }}
                      >
                        {placeName}
                      </Text>
                      <Text
                        style={{ marginTop: 4, fontWeight: '300' }}
                        numberOfLines={2}
                      >
                        {generateCityAndRouteName(
                          geocodeMarker.length < 1
                            ? selectedGeocode
                            : geocodeMarker,
                        ).routeName || '-'}
                      </Text>
                    </View>
                  </View>
                )}
              </Animated.View>
            )}
          </View>
          {searchResult.length < 1 && isSearching ? (
            <LoadingBase />
          ) : searchResult.length < 1 && searchError ? (
            <ErrorBase
              error={searchError}
              onReload={() => setIsLoading(true)}
            />
          ) : (
            <Animated.View style={[{ flex: 1 }, opacitySearchResultWrapper]}>
              <InfiniteScroll
                onLoading={() => setIsSearching(true)}
                hasReachedBottom={pageToken === null}
              >
                <View style={{ gap: 10, paddingTop: 15 }}>
                  {searchResult.map((row, i) => {
                    return (
                      <Pressable
                        key={i}
                        onPress={() => {
                          if (row.geometry?.location) {
                            const { lat, lng } = row.geometry.location;
                            setLocationMarker({
                              latitude: lat,
                              longitude: lng,
                            });
                            mapRef.current?.animateToRegion({
                              latitude: lat,
                              longitude: lng,
                              latitudeDelta: LATITUDE_DELTA,
                              longitudeDelta: LONGITUDE_DELTA,
                            });
                            setShowMap(true);
                          }
                        }}
                      >
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: themeColors.borderColor,
                            borderRadius: ROUNDED_SIZE,
                            padding: 20,
                          }}
                        >
                          <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                            {row.name}
                          </Text>
                          <Text style={{ fontWeight: '300' }}>
                            {row.formatted_address}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </InfiniteScroll>
            </Animated.View>
          )}
        </View>
        {showMap && (
          <Animated.View
            style={{
              position: 'absolute',
              bottom: insets.bottom,
              left: 0,
              right: 0,
              padding: 20,
              opacity: opacityPlaceInfo,
            }}
          >
            <Button
              disabled={isLoading || isDragging || !locationMarker}
              onPress={() => {
                if (locationMarker) {
                  dispatch(
                    setSelectedLocation({
                      latitude: locationMarker.latitude,
                      longitude: locationMarker.longitude,
                    }),
                  );
                  navigation.goBack();
                }
              }}
              style={{ marginTop: 20 }}
            >
              Konfirm
            </Button>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
