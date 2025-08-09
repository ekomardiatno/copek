/* eslint-disable react-native/no-inline-styles */
import {
  JSX,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ScrollView, Text, TouchableHighlight, View } from 'react-native';
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
  MerchantType,
} from '../../types/food-collection-types';
import Spinner from '../../components/Spinner';
import getImageThumb from '../../utils/getImageThumb';
import { CurrentGeocodeLocationContext } from '../../components/CurrentGeocodeLocationProvider';
import useAppNavigation from '../../hooks/useAppNavigation';
import useAppSelector from '../../hooks/useAppSelector';

export default function FoodScreen(): JSX.Element {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const currentLocation = useAppSelector<SimpleLocationType | null>(
    state => state.appReducer.currentLocation,
  )
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

  const fetchCollection = useCallback(
    async (signal?: AbortSignal) => {
      if (!isLoadingCollection) return;
      if (!currentLocation) return;
      if (!cityName) return;
      console.log(signal);
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
      <SimpleHeader title="Food & Beverage" />
      <TouchableHighlight
        style={{ borderRadius: 10, marginHorizontal: 15, marginBottom: 20 }}
        activeOpacity={0.85}
        onPress={() => {
          navigation.navigate('SearchMenu');
        }}
      >
        <View
          style={{
            height: 40,
            overflow: 'hidden',
            backgroundColor: themeColors.grayLighter,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="magnifying-glass"
              color={themeColors.textMuted}
              size={16}
            />
          </View>
          <Text
            style={{
              color: themeColors.textMuted,
              paddingHorizontal: 6,
              paddingRight: 10,
              letterSpacing: 1,
            }}
          >
            Mau makan apa hari ini?
          </Text>
        </View>
      </TouchableHighlight>
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
          <TouchableHighlight onPress={() => setIsLoadingCollection(true)}>
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
          </TouchableHighlight>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 0,
            paddingVertical: 20,
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
                                ? Number(foodItem.foodDiscount)
                                : undefined
                            }
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
                          />
                        );
                      }
                    })}
                  </View>
                </ItemContainer>
              );
            }
          })}
        </ScrollView>
      )}
    </View>
  );
}
