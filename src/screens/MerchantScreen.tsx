/* eslint-disable react-native/no-inline-styles */
import React, {
  JSX,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Linking, View, Image, Text } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { MerchantDetailsType } from '../types/merchant-types';
import { FoodMerchantType } from '../types/food-collection-types';
import { useRoute } from '@react-navigation/native';
import { AppRouteProp } from '../types/navigation';
import useAppNavigation from '../hooks/useAppNavigation';
import {
  getFoodByMerchant,
  getMerchantDetail,
} from '../services/copek-food-services';
import parsingError from '../utils/parsingError';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import Icon from '../components/Icon';
import { themeColors } from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import getImageThumb from '../utils/getImageThumb';
import Dash from 'react-native-dash-2';
import modDistance from '../utils/modDistance';
import { colorYiq, distanceMeasurement } from '../utils';
import LoadingBase from '../components/LoadingBase';
import ErrorBase from '../components/ErrorBase';
import FoodItem, { FoodItemContext } from '../components/FoodItem';
import { MerchantContext } from '../components/MerchantProvider';
import { CartContext } from '../components/CartProvider';
import Pressable from '../components/Pressable';
import { GeolocationContext } from '../components/GeolocationProvider';

export default function MerchantScreen(): JSX.Element {
  const route = useRoute<AppRouteProp<'Merchant'>>();
  const params = route.params.params;
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const navigation = useAppNavigation();
  const [isMerchantLoading, setIsMerchantLoading] = useState(true);
  const { currentLocation } = useContext(GeolocationContext);
  const [merchantRequestError, setMerchantRequestError] = useState<
    TypeError | Error | null
  >(null);
  const [merchantDetail, setMerchantDetail] =
    useState<MerchantDetailsType | null>(null);
  const [isFoodLoading, setIsFoodLoading] = useState(true);
  const [foodRequestError, setFoodRequestError] = useState<
    TypeError | Error | null
  >(null);
  const [foodList, setFoodList] = useState<FoodMerchantType[]>([]);
  const { setFoodIdToPreview } = useContext(FoodItemContext);
  const { setMerchantIsBeingViewed } = useContext(MerchantContext);

  useEffect(() => {
    if (!params?.merchantId) navigation.goBack();
  }, [navigation, params]);

  useEffect(() => {
    if (params?.foodId) setFoodIdToPreview(params.foodId);
  }, [params, setFoodIdToPreview]);

  const abortController = useRef<AbortController | null>(null);
  useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current?.abort();
    };
  }, []);

  const fetchFoodList = useCallback(
    async (signal?: AbortSignal) => {
      if (!isFoodLoading) return;
      if (!params?.merchantId) return;
      setFoodRequestError(null);
      try {
        const result = await getFoodByMerchant(params.merchantId, signal);
        setFoodList(result);
      } catch (e) {
        setFoodRequestError(parsingError(e));
      } finally {
        setIsFoodLoading(false);
      }
    },
    [isFoodLoading, params],
  );

  const fetchMerchant = useCallback(
    async (signal?: AbortSignal) => {
      if (!isMerchantLoading) return;
      if (!params?.merchantId) return;
      setMerchantRequestError(null);
      try {
        const result = await getMerchantDetail(params.merchantId, signal);
        setMerchantDetail(result);
        setMerchantIsBeingViewed(result);
      } catch (e) {
        setMerchantRequestError(parsingError(e));
      } finally {
        setIsMerchantLoading(false);
      }
    },
    [isMerchantLoading, params, setMerchantIsBeingViewed],
  );

  useEffect(() => {
    return () => {
      setMerchantIsBeingViewed(null);
    };
  }, [setMerchantIsBeingViewed]);

  useEffect(() => {
    const signal = abortController.current?.signal;
    fetchMerchant(signal);
  }, [fetchMerchant]);

  useEffect(() => {
    const signal = abortController.current?.signal;
    fetchFoodList(signal);
  }, [fetchFoodList]);

  const scrollY = useSharedValue(0);
  const heightImg = (frame.width / 4) * 3;
  const lastScrollY = useSharedValue(0);
  const { showProccedToCheckoutButton, hideProccedToCheckoutButton } =
    useContext(CartContext);

  const opacityHeader = useSharedValue(0);
  const opacityHideHeader = useSharedValue(1);

  const opacityMapLocation = useSharedValue(1);

  const heightThumbnail = useSharedValue(heightImg);
  const bottomRadiusThumbnail = useSharedValue(20);

  if (isMerchantLoading)
    return <LoadingBase onCancel={() => navigation.goBack()} />;

  if (merchantRequestError)
    return (
      <ErrorBase
        error={merchantRequestError}
        onReload={() => setIsMerchantLoading(true)}
      />
    );

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: themeColors.white,
          opacity: 0.5,
          zIndex: 3,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          zIndex: 2,
          paddingTop: insets.top,
          paddingHorizontal: 15,
        }}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,.35)',
              opacity: opacityHeader,
            },
          ]}
        />
        <View style={{ paddingVertical: 10 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ borderRadius: 20 }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,.35)',
                    opacity: opacityHideHeader,
                  },
                ]}
              />
              <Icon name="chevron-left" color={themeColors.white} size={18} />
            </View>
          </Pressable>
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}
        >
          <Animated.Text
            numberOfLines={1}
            style={[
              {
                fontWeight: 'bold',
                fontSize: 18,
                color: themeColors.white,
                opacity: opacityHeader,
              },
            ]}
          >
            {merchantDetail?.merchantName}
          </Animated.Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#333',
            height: heightThumbnail,
            borderBottomLeftRadius: bottomRadiusThumbnail,
            borderBottomRightRadius: bottomRadiusThumbnail,
            elevation: 2
          },
        ]}
      >
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                height: insets.top,
                left: 0,
                right: 0,
                zIndex: 1,
                opacity: opacityHideHeader,
              },
            ]}
          >
            <LinearGradient
              style={{ flex: 1 }}
              colors={['rgba(0,0,0,.75)', 'rgba(0,0,0,.25)', 'transparent']}
            />
          </Animated.View>
          <Animated.View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderBottomLeftRadius: bottomRadiusThumbnail,
              borderBottomRightRadius: bottomRadiusThumbnail,
            }}
          >
            <Image
              style={{ width: '100%', height: '100%' }}
              source={{
                uri: getImageThumb(merchantDetail?.merchantPicture || '', 'md'),
              }}
            />
          </Animated.View>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            bottom: -20,
          }}
        >
          <Pressable
            style={{ borderRadius: 3 }}
            disabled={!merchantDetail}
            onPress={() =>
              Linking.openURL(
                `geo:${merchantDetail?.merchantLatitude},${merchantDetail?.merchantLongitude}?q=${merchantDetail?.merchantLatitude},${merchantDetail?.merchantLongitude}`,
              )
            }
          >
            <Animated.View
              style={[
                {
                  elevation: 5,
                  height: 60,
                  width: 60,
                  borderRadius: 60 / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: themeColors.primary,
                  opacity: opacityMapLocation,
                },
              ]}
            >
              <Icon
                name="map-location-dot"
                size={24}
                color={colorYiq(themeColors.primary)}
              />
            </Animated.View>
          </Pressable>
        </View>
      </Animated.View>
      {isFoodLoading ? (
        <LoadingBase />
      ) : foodRequestError ? (
        <ErrorBase
          error={foodRequestError}
          onReload={() => setIsFoodLoading(true)}
        />
      ) : (
        <Animated.ScrollView
          onScroll={e => {
            scrollY.value = withSpring(e.nativeEvent.contentOffset.y);
            if (e.nativeEvent.contentOffset.y >= 190) {
              heightThumbnail.value = withSpring(insets.top + 60);
              opacityHeader.value = withSpring(1);
              opacityHideHeader.value = withSpring(0);
              opacityMapLocation.value = withSpring(0);
              bottomRadiusThumbnail.value = withSpring(0)
            } else {
              heightThumbnail.value = withSpring(heightImg);
              opacityHideHeader.value = withSpring(1);
              opacityMapLocation.value = withSpring(1);
              opacityHeader.value = withSpring(0);
              bottomRadiusThumbnail.value = withSpring(20)
            }
          }}
          onScrollEndDrag={e => {
            if (e.nativeEvent.contentOffset.y > lastScrollY.value) {
              hideProccedToCheckoutButton();
            } else {
              showProccedToCheckoutButton();
            }
          }}
          onMomentumScrollEnd={e => {
            lastScrollY.set(e.nativeEvent.contentOffset.y);
            if (e.nativeEvent.contentOffset.y === 0) {
              showProccedToCheckoutButton();
            }
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.white,
              borderBottomColor: themeColors.borderColor,
              borderBottomWidth: 1,
            }}
          >
            <View
              style={{
                paddingHorizontal: 15,
                position: 'relative',
                paddingTop: heightImg,
              }}
            >
              <View style={{ marginTop: 15 }}>
                <Text
                  style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 3 }}
                >
                  {merchantDetail?.merchantName || '-'}
                </Text>
                <Text
                  style={{
                    marginBottom: 15,
                    fontSize: 15,
                    color: themeColors.textMuted,
                    fontWeight: '300',
                  }}
                >
                  {merchantDetail?.merchantAddress || '-'}
                </Text>
                <Dash
                  dashThickness={1}
                  dashLength={2}
                  dashGap={2}
                  dashColor={themeColors.borderColor}
                  style={{
                    width: '100%',
                    height: 1,
                    transform: [{ translateY: -1.5 }],
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}
                >
                  <Icon name="route" size={16} color={themeColors.red} />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 17,
                      marginTop: 2,
                      paddingLeft: 5,
                    }}
                  >
                    {merchantDetail && currentLocation
                      ? modDistance(
                          Number(
                            (
                              distanceMeasurement(
                                currentLocation.latitude,
                                currentLocation.longitude,
                                Number(merchantDetail.merchantLatitude),
                                Number(merchantDetail.merchantLongitude),
                                'K',
                              ) * 1000
                            ).toFixed(0),
                          ),
                        )
                      : '-'}
                  </Text>
                </View>
              </View>
              {/* <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                  <Feather name='clock' size={15} color={themeColors.green} />
                  <Text style={{ color: themeColors.green, textTransform: 'uppercase', fontSize: 12 }}> Buka</Text>
                  <Text style={{ fontSize: 12 }}>  hingga 23:59 hari ini</Text>
                </View> */}
            </View>
          </View>
          <View
            style={{
              backgroundColor: themeColors.white,
              marginBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.borderColor,
            }}
          >
            <View
              style={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                backgroundColor: themeColors.grayLighter,
                borderBottomColor: themeColors.borderColor,
                borderBottomWidth: 1,
              }}
            >
              <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                Menu Spesial
              </Text>
            </View>
            <View
              style={{
                backgroundColor: themeColors.borderColor,
                gap: 1,
                marginTop: 1,
                marginHorizontal: 15,
              }}
            >
              {foodList.map(item => {
                return <FoodItem key={item.foodId} item={item} />;
              })}
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
}
