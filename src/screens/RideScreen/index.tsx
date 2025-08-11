/* eslint-disable react-native/no-inline-styles */
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Image, Text, TextInput, View } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  ROUNDED_SIZE,
  themeColors,
} from '../../constants';
import Icon from '../../components/Icon';
import { useNavigation } from '@react-navigation/native';
import { CustomButton } from '../SelectLocationScreen';
import InfiniteScroll from '../../components/InfiniteScroll';
import Dash from 'react-native-dash-2';
import { PlaceType } from '../../types/google-map-types';
import parsingError from '../../utils/parsingError';
import useAppSelector from '../../hooks/useAppSelector';
import { getGeocode, searchPlace } from '../../services/google-services';
import ErrorBase from '../../components/ErrorBase';
import LoadingBase from '../../components/LoadingBase';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { generateCityAndRouteName, generatePlaceName } from '../../utils';
import Button from '../../components/Button';
import MapView from 'react-native-maps';
import {
  setDestinationGeocode,
  setSelectedGeocode,
} from '../../redux/actions/geocode.action';
import { useDispatch } from 'react-redux';
import { SimpleLocationType } from '../../redux/reducers/app.reducer';
import Spinner from '../../components/Spinner';
import {
  setDestinationLocation,
  setSelectedLocation,
} from '../../redux/actions/geolocation.action';
import Pressable from '../../components/Pressable';
import Geolocation from '@react-native-community/geolocation';

// By default destinationLocation is null, so we need to set destination, once destinationLocation was set, we will need to set pick up location or set it on selectedLocation

export default function RideScreen(): JSX.Element {
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<PlaceType[]>([]);
  const [searchError, setSearchError] = useState<Error | TypeError | null>(
    null,
  );
  const [pageToken, setPageToken] = useState<string | null>('');

  // redux
  const currentGeolocation = useAppSelector(
    state => state.geolocationReducer.currentGeolocation,
  );
  const currentGeocode = useAppSelector(
    state => state.geocodeReducer.currentGeocode,
  );
  const destinationLocation = useAppSelector(
    state => state.geolocationReducer.destinationLocation,
  );

  // Initial animation value
  const heightForSearchShown = frame.height - insets.top;
  const heightForSearchhidden = 285;

  // Animation value
  const heightSearchArea = useSharedValue(heightForSearchShown);
  const roundedSearchArea = useSharedValue(0);
  const opacityOpenSearchButton = useSharedValue(1);
  const opacitySearchResultContainer = useSharedValue(1);
  const translateXMarker = useSharedValue(0);

  // Map States
  const [isMapViewed, setIsMapViewed] = useState(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isSearchShow, setIsSearchShow] = useState(true);

  // Candidate location states
  const [
    isGettingCandidateDestinationGeocode,
    setIsGettingCandidateDestinationGeocode,
  ] = useState<boolean>(false);
  const [candidateGeocodeRequestError, setCandidateGeocodeRequestError] =
    useState<Error | TypeError | null>(null);
  const [candidateLocation, setCandidateLocation] =
    useState<SimpleLocationType | null>(null);
  const [candidateGeocode, setCandidateGeocode] = useState<PlaceType[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setDestinationGeocode([]));
      dispatch(setDestinationLocation(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (candidateLocation !== null) {
      setIsSearchShow(false);
    }
  }, [candidateLocation]);

  const goToCurrentLocation = () => {
    Geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      mapRef.current?.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    });
  };

  useEffect(() => {
    if (destinationLocation) {
      opacityOpenSearchButton.value = withSpring(0);
    } else {
      opacityOpenSearchButton.value = withSpring(1);
    }
  }, [destinationLocation, opacityOpenSearchButton]);

  useEffect(() => {
    if (destinationLocation && currentGeolocation) {
      const { latitude, longitude } = currentGeolocation;
      mapRef.current?.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [currentGeolocation, destinationLocation]);

  useEffect(() => {
    if (isSearchShow) {
      setIsMapViewed(prevState => (!prevState ? true : prevState));
      heightSearchArea.value = withSpring(heightForSearchShown);
      roundedSearchArea.value = withSpring(0);
      opacitySearchResultContainer.value = withSpring(1);
      opacityOpenSearchButton.value = withSpring(0);
    } else {
      heightSearchArea.value = withSpring(heightForSearchhidden);
      roundedSearchArea.value = withSpring(20);
      opacitySearchResultContainer.value = withSpring(0);
      opacityOpenSearchButton.value = withSpring(1);
    }
  }, [
    heightForSearchShown,
    heightSearchArea,
    isSearchShow,
    opacityOpenSearchButton,
    opacitySearchResultContainer,
    roundedSearchArea,
  ]);

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

  const fetchGeocode = useCallback(
    async (signal?: AbortSignal) => {
      if (!isGettingCandidateDestinationGeocode) return;
      if (!candidateLocation) return;
      setCandidateGeocodeRequestError(null);
      try {
        const response = await getGeocode(candidateLocation, signal);
        setCandidateGeocode(response);
      } catch (e) {
        if (e instanceof Error || e instanceof TypeError) {
          setCandidateGeocodeRequestError(e);
        } else {
          setCandidateGeocodeRequestError(new Error('Failed to get geocode'));
        }
      } finally {
        setIsGettingCandidateDestinationGeocode(false);
      }
    },
    [isGettingCandidateDestinationGeocode, candidateLocation],
  );

  useEffect(() => {
    const signal = abortController.current?.signal;
    fetchGeocode(signal);
  }, [fetchGeocode]);

  const handleBack = useCallback(() => {
    if (destinationLocation) {
      const { latitude, longitude } = destinationLocation;
      mapRef.current?.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      dispatch(setDestinationLocation(null));
      dispatch(setDestinationGeocode([]));
    } else {
      navigation.goBack();
    }
  }, [destinationLocation, dispatch, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBack();
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
  }, [handleBack]);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: heightForSearchhidden - 20,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: themeColors.grayLight,
            position: 'relative',
          }}
        >
          {isMapViewed && (
            <MapView
              ref={mapRef}
              provider="google"
              style={{ width: '100%', height: '100%', position: 'relative' }}
              initialRegion={{
                latitude:
                  candidateLocation?.latitude ||
                  currentGeolocation?.latitude ||
                  0,
                longitude:
                  candidateLocation?.longitude ||
                  currentGeolocation?.longitude ||
                  0,
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
                  setIsGettingCandidateDestinationGeocode(true);
                  setCandidateLocation({
                    latitude: e.latitude,
                    longitude: e.longitude,
                  });
                } else {
                  setIsMapReady(true);
                }
              }}
              mapPadding={{ bottom: 20, right: 10, left: 10, top: 10 }}
              showsUserLocation
              showsTraffic
              showsMyLocationButton={false}
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
                borderWidth: 1,
                borderColor: themeColors.borderColor,
                backgroundColor: destinationLocation
                  ? themeColors.primary
                  : themeColors.secondary,
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
              {destinationLocation ? (
                <Image
                  source={require('../../assets/images/icons/passenger-marker.png')}
                  style={{ width: 40, height: 40, marginTop: -31 }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/icons/destination-marker.png')}
                  style={{ width: 40, height: 40, marginTop: -31 }}
                />
              )}
            </Animated.View>

            {isGettingCandidateDestinationGeocode && (
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
        </View>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: heightSearchArea,
          backgroundColor: themeColors.white,
          borderRadius: roundedSearchArea,
        }}
      >
        <View style={{ position: 'absolute', top: -46, right: 20 }}>
          {destinationLocation && (
            <Pressable
              onPress={() => {
                goToCurrentLocation();
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  backgroundColor: themeColors.white,
                  borderWidth: 1,
                  borderColor: themeColors.borderColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 3,
                }}
              >
                <Icon
                  name="location-arrow"
                  color={themeColors.blue}
                  size={16}
                />
              </View>
            </Pressable>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 15,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Pressable
              viewStyle={{ flexGrow: 0 }}
              onPress={handleBack}
              style={{ paddingRight: 15 }}
            >
              <Icon name="chevron-left" size={16} />
            </Pressable>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
              {isSearchShow
                ? 'Mau kemana?'
                : destinationLocation
                ? 'Pilih lokasi jemput'
                : 'Pilih tujuan'}
            </Text>
          </View>
          <Animated.View style={{ opacity: opacityOpenSearchButton }}>
            <CustomButton
              disabled={isSearchShow || destinationLocation !== null}
              onPress={() => {
                setIsSearchShow(true);
              }}
              icon="magnifying-glass"
              iconColor={themeColors.yellow}
            >
              Cari lokasi
            </CustomButton>
          </Animated.View>
        </View>
        <View style={{ position: 'relative' }}>
          <View
            style={{
              paddingBottom: 15,
              borderBottomColor: themeColors.borderColor,
              borderBottomWidth: 1,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ position: 'relative' }}>
              <View
                style={{
                  backgroundColor: themeColors.grayLighter,
                  borderRadius: ROUNDED_SIZE,
                  borderColor: themeColors.borderColor,
                  borderWidth: 1,
                  padding: 15,
                  paddingVertical: 12,
                  gap: 12,
                  position: 'relative',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 15,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: themeColors.blue,
                    }}
                  >
                    <Icon name="arrow-up" color={themeColors.white} size={12} />
                  </View>
                  <Text style={{ fontWeight: '300', fontSize: 13 }}>
                    Lokasimu saat ini
                  </Text>
                </View>
                <View style={{ paddingLeft: 35, paddingRight: 0 }}>
                  <View
                    style={{
                      backgroundColor: themeColors.borderColor,
                      width: '100%',
                      height: 1,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 15,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: themeColors.yellow,
                    }}
                  >
                    <Icon name="circle" color={themeColors.white} size={7} />
                  </View>
                  <TextInput
                    style={{
                      fontSize: 13,
                      fontWeight: '300',
                      color: themeColors.textColor,
                      paddingVertical: 0,
                      paddingHorizontal: 0,
                      width: frame.width - 105,
                      marginVertical: 0,
                      marginHorizontal: 0,
                    }}
                    placeholderTextColor={themeColors.textHint}
                    placeholder="Cari tujuanmu disini"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onChange={handleSearchQueryChanged}
                  />
                </View>
              </View>
              <Dash
                dashThickness={1}
                dashLength={2}
                dashGap={2}
                dashColor={themeColors.textHint}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 18,
                  width: 15,
                  height: 1,
                  transform: [{ rotate: '90deg' }],
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 15,
              }}
            >
              <CustomButton
                onPress={() => {
                  setIsSearchShow(false);
                }}
                icon="map-location"
                iconColor={themeColors.green}
              >
                Pilih di map
              </CustomButton>
            </View>
          </View>
          {!isSearchShow && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: frame.width,
                right: 0,
                bottom: -20,
                backgroundColor: themeColors.white,
              }}
            >
              {candidateGeocodeRequestError ? (
                <ErrorBase
                  mode="horizontal"
                  error={candidateGeocodeRequestError}
                  onReload={() => setIsGettingCandidateDestinationGeocode(true)}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 20,
                    padding: 10,
                    backgroundColor: themeColors.grayLighter,
                    borderRadius: ROUNDED_SIZE,
                    borderWidth: 1,
                    borderColor: themeColors.borderColor,
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        backgroundColor: destinationLocation
                          ? themeColors.blue
                          : themeColors.yellow,
                      }}
                    >
                      {destinationLocation ? (
                        <Icon
                          name="arrow-up"
                          size={17}
                          color={themeColors.white}
                        />
                      ) : (
                        <View
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 100,
                            backgroundColor: themeColors.white,
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                        }}
                      >
                        {generatePlaceName(
                          candidateGeocode.length < 1
                            ? currentGeocode
                            : candidateGeocode,
                        )}
                      </Text>
                      <Text
                        style={{
                          marginTop: 4,
                          fontWeight: '300',
                          fontSize: 12,
                        }}
                        numberOfLines={2}
                      >
                        {generateCityAndRouteName(
                          candidateGeocode.length < 1
                            ? currentGeocode
                            : candidateGeocode,
                        ).routeName || '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={{ padding: 20, justifyContent: 'center' }}>
                <Button
                  disabled={
                    isDragging ||
                    isGettingCandidateDestinationGeocode ||
                    candidateLocation === null ||
                    candidateGeocodeRequestError !== null
                  }
                  color={
                    destinationLocation ? themeColors.blue : themeColors.yellow
                  }
                  onPress={() => {
                    if (!destinationLocation) {
                      dispatch(setDestinationGeocode(candidateGeocode));
                      dispatch(setDestinationLocation(candidateLocation));
                    } else {
                      dispatch(setSelectedLocation(candidateLocation));
                      dispatch(setSelectedGeocode(candidateGeocode));
                      console.log('Proceed to checkout');
                    }
                  }}
                >
                  {destinationLocation ? 'Pesan Ojek' : 'Lanjut'}
                </Button>
              </View>
            </View>
          )}
        </View>

        {searchResult.length < 1 && isSearching ? (
          <LoadingBase />
        ) : searchResult.length < 1 && searchError ? (
          <ErrorBase
            error={searchError}
            onReload={() => setIsSearching(true)}
          />
        ) : (
          <Animated.View
            style={{
              flex: 1,
              opacity: opacitySearchResultContainer,
              paddingBottom: insets.bottom,
            }}
          >
            <InfiniteScroll
              loading={isSearching}
              onLoading={() => setIsSearching(true)}
              contentContainerStyle={{ padding: 20, paddingVertical: 15 }}
              hasReachedBottom={pageToken === null}
            >
              <View style={{ gap: 10 }}>
                {searchResult.map((row, i) => {
                  return (
                    <Pressable
                      key={i}
                      onPress={() => {
                        if (row.geometry?.location) {
                          const { lat, lng } = row.geometry.location;
                          setCandidateLocation({
                            latitude: lat,
                            longitude: lng,
                          });
                          mapRef.current?.animateToRegion({
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                          });
                          setIsGettingCandidateDestinationGeocode(true);
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
      </Animated.View>
    </View>
  );
}
