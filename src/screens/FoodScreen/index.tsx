/* eslint-disable react-native/no-inline-styles */
import {
  JSX,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleHeader from '../../components/SimpleHeader';
import { themeColors } from '../../constants';
import Icon from '../../components/Icon';
import ItemContainer from '../../components/ItemContainer';
import ItemVertical from '../../components/ItemVertical';
import ItemHorizontal from '../../components/ItemHorizontal';
import { SimpleLocationType } from '../../redux/reducers/app.reducer';
import { getFoodHomeCollection } from '../../services/copek-food-services';
import {
  FoodCollectionType,
  FoodType,
} from '../../types/food-collection-types';
import Spinner from '../../components/Spinner';
import getImageThumb from '../../utils/getImageThumb';
import { CurrentGeocodeLocationContext } from '../../components/CurrentGeocodeLocationProvider';
import useAppNavigation from '../../hooks/useAppNavigation';
import useAppSelector from '../../hooks/useAppSelector';
import { MerchantType } from '../../types/merchant-types';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { CartContext } from '../../components/CartProvider';
import Pressable from '../../components/Pressable';
import Input from '../../components/Input';

export default function FoodScreen(): JSX.Element {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const currentLocation = useAppSelector<SimpleLocationType | null>(
    state => state.appReducer.currentLocation,
  );
  const { currentGeocodeLocation: geocode } = useContext(
    CurrentGeocodeLocationContext,
  );
  const [cityName, setCityName] = useState<string>('');
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);
  const [collectionRequestError, setCollectionRequestError] = useState<
    Error | TypeError | null
  >(null);
  const [foodCollection, setFoodCollection] = useState<FoodCollectionType[]>(
    [],
  );
  const lastScrollY = useSharedValue(0)
  const {showProccedToCheckoutButton, hideProccedToCheckoutButton} = useContext(CartContext)

  const fetchCollection = useCallback(
    async (signal?: AbortSignal) => {
      if (!isLoadingCollection) return;
      if (!currentLocation) return;
      if (!cityName) return;
      setCollectionRequestError(null);
      try {
        const result = await getFoodHomeCollection(
          cityName,
          currentLocation,
          signal,
        );
        setFoodCollection(result);
      } catch (e) {
        const error =
          e instanceof Error || e instanceof TypeError
            ? e
            : new Error('Failed to load food collection');
        setCollectionRequestError(error);
      } finally {
        setIsLoadingCollection(false);
      }
    },
    [cityName, currentLocation, isLoadingCollection],
  );

  const abortController = useRef<AbortController | null>(null);
  useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current?.abort();
    };
  }, []);

  useEffect(() => {
    const signal = abortController.current?.signal;
    fetchCollection(signal);
  }, [fetchCollection]);

  useEffect(() => {
    if (geocode.length > 0) {
      const findCity = geocode.find(row =>
        row.types?.includes('administrative_area_level_2'),
      );
      if (findCity) {
        const city = findCity.address_components?.find(row =>
          row.types?.includes('administrative_area_level_2'),
        );
        setCityName(city?.short_name || '');
      } else {
        const city = geocode[0].address_components?.find(row =>
          row.types?.includes('administrative_area_level_2'),
        );
        setCityName(city?.short_name || '');
      }
    }
  }, [geocode]);

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <SimpleHeader title="Makanan & Minuman" />
      <Pressable
        style={{ borderRadius: 10, marginHorizontal: 15, marginBottom: 15 }}
        onPress={() => {
          navigation.navigate('SearchMenu');
        }}
      >
        <Input iconName='magnifying-glass' placeholder='Mau makan apa hari ini?' readOnly />
      </Pressable>
      {isLoadingCollection ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 15,
          }}
        >
          <Spinner />
        </View>
      ) : collectionRequestError ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Icon name="triangle-exclamation" color={themeColors.red} size={40} />
          <Text style={{ fontWeight: 'bold' }}>
            {collectionRequestError?.message || 'Terjadi kesalahan'}
          </Text>
          <Pressable onPress={() => setIsLoadingCollection(true)}>
            <View
              style={{
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: themeColors.red,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: themeColors.white, textAlign: 'center' }}>
                Coba lagi
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <Animated.ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 0,
            paddingVertical: 20,
          }}
          onScrollEndDrag={e => {
            if(e.nativeEvent.contentOffset.y > lastScrollY.value) {
              hideProccedToCheckoutButton()
            } else {
              showProccedToCheckoutButton()
            }
          }}
          onMomentumScrollEnd={e => {
            lastScrollY.set(e.nativeEvent.contentOffset.y)
            if(e.nativeEvent.contentOffset.y === 0) {
              showProccedToCheckoutButton()
            }
          }}
        >
          {foodCollection.map((row, i) => {
            if (row.style === 'sliding') {
              return (
                <ItemContainer
                  key={i}
                  title={row.title[0]}
                  subTitle={row.title[1]}
                  horizontalScroll
                  containerStyle={{
                    marginTop: i === 0 ? 0 : 20,
                    marginHorizontal: -20,
                  }}
                  onSeeMore={() => {
                    navigation.navigate(
                      row.category === 'food' ? 'List Menu' : 'List Merchant',
                      {
                        params: {
                          moreCategory: row.more,
                        },
                      },
                    );
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 15,
                      paddingHorizontal: 20,
                    }}
                  >
                    {row.data.map((item, j) => {
                      if (row.category === 'food' && item) {
                        const foodItem = item as FoodType;
                        return (
                          <ItemVertical
                            key={`${i}_${j}`}
                            imgUri={getImageThumb(foodItem.foodPicture, 'sm')}
                            title={foodItem.foodName}
                            price={
                              Number(foodItem.foodPrice) -
                              (Number(foodItem.foodDiscount) / 100) *
                                Number(foodItem.foodPrice)
                            }
                            priceBeforeDisc={
                              Number(foodItem.foodDiscount) > 0
                                ? Number(foodItem.foodPrice)
                                : undefined
                            }
                            onPress={() => {
                              navigation.navigate('Merchant', {
                                params: {
                                  merchantId: foodItem.merchantId,
                                  foodId: foodItem.foodId
                                },
                              });
                            }}
                          />
                        );
                      } else {
                        const merchant = item as MerchantType;
                        return (
                          <ItemVertical
                            key={`${i}_${j}`}
                            imgUri={getImageThumb(
                              merchant.merchantPicture,
                              'sm',
                            )}
                            title={merchant.merchantName}
                            distance={Number(merchant.merchantDistance)}
                            onPress={() => {
                              navigation.navigate('Merchant', {
                                params: {
                                  merchantId: merchant.merchantId
                                },
                              });
                            }}
                          />
                        );
                      }
                    })}
                  </View>
                </ItemContainer>
              );
            } else if (row.style === 'list') {
              return (
                <ItemContainer
                  key={i}
                  title={row.title[0]}
                  subTitle={row.title[1]}
                  containerStyle={{ marginHorizontal: -20, marginTop: 20 }}
                  onSeeMore={() => {
                    navigation.navigate(
                      row.category === 'food' ? 'List Menu' : 'List Merchant',
                      {
                        params: {
                          moreCategory: row.more,
                        },
                      },
                    );
                  }}
                >
                  <View style={{ gap: 10, marginHorizontal: 20 }}>
                    {row.data.map((item, j) => {
                      if (row.category === 'food') {
                        const foodItem = item as FoodType;
                        return (
                          <ItemHorizontal
                            key={`${i}_${j}`}
                            imgUri={getImageThumb(foodItem.foodPicture, 'sm')}
                            title={foodItem.foodName}
                            subTitle={foodItem.merchantName}
                            price={
                              Number(foodItem.foodPrice) -
                              (Number(foodItem.foodDiscount) / 100) *
                                Number(foodItem.foodPrice)
                            }
                            priceBeforeDisc={
                              Number(foodItem.foodDiscount) > 0
                                ? Number(foodItem.foodPrice)
                                : undefined
                            }
                            onPress={() => {
                              navigation.navigate('Merchant', {
                                params: {
                                  merchantId: foodItem.merchantId,
                                  foodId: foodItem.foodId
                                },
                              });
                            }}
                          />
                        );
                      } else {
                        const merchantItem = item as MerchantType;
                        return (
                          <ItemHorizontal
                            key={`${i}_${j}`}
                            imgUri={getImageThumb(
                              merchantItem.merchantPicture ?? '',
                              'sm',
                            )}
                            title={merchantItem.merchantName}
                            subTitle={merchantItem.merchantName}
                            distance={Number(merchantItem.merchantDistance)}
                            onPress={() => {
                              navigation.navigate('Merchant', {
                                params: {
                                  merchantId: merchantItem.merchantId
                                },
                              });
                            }}
                          />
                        );
                      }
                    })}
                  </View>
                </ItemContainer>
              );
            }
          })}
        </Animated.ScrollView>
      )}
    </View>
  );
}
