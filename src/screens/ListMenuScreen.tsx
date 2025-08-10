/* eslint-disable react-native/no-inline-styles */
import {
  JSX,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleHeader from '../components/SimpleHeader';
import { View } from 'react-native';
import InfiniteScroll from '../components/InfiniteScroll';
import { FoodType } from '../types/food-collection-types';
import parsingError from '../utils/parsingError';
import { GeocodeContext } from '../components/GeocodeProvider';
import { searchFood } from '../services/copek-food-services';
import ItemHorizontal from '../components/ItemHorizontal';
import getImageThumb from '../utils/getImageThumb';
import LoadingBase from '../components/LoadingBase';
import ErrorBase from '../components/ErrorBase';
import { useRoute } from '@react-navigation/native';
import { AppRouteProp } from '../types/navigation';
import useAppNavigation from '../hooks/useAppNavigation';
import { GeolocationContext } from '../components/GeolocationProvider';

export default function ListMenuScreen(): JSX.Element {
  const route = useRoute<AppRouteProp<'List Menu'>>();
  const params = route.params.params;
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const { currentCityName } = useContext(GeocodeContext);
  const { currentLocation } = useContext(GeolocationContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TypeError | Error | null>(null);
  const [data, setData] = useState<FoodType[]>([]);
  const [page, setPage] = useState(1);

  const fetchMenu = useCallback(
    async (signal?: AbortSignal) => {
      if (hasReachedBottom) {
        setLoading(false);
        return;
      }
      if (!currentLocation) return;
      if (!currentCityName) return;
      if (!loading) return;
      setError(null);
      try {
        const result = await searchFood(
          '',
          currentCityName,
          currentLocation,
          page,
          params?.moreCategory,
          signal,
        );
        if (result.length === 0) {
          setHasReachedBottom(true);
        } else {
          setPage(p => p + 1);
        }
        setData(prev => [...prev, ...result]);
      } catch (e) {
        const parsedError = parsingError(e);
        setError(parsedError);
      } finally {
        setLoading(false);
      }
    },
    [hasReachedBottom, currentLocation, currentCityName, loading, page, params],
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
    fetchMenu(signal);
  }, [fetchMenu]);

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <SimpleHeader title="Daftar Menu" />
      {loading && page === 1 ? (
        <LoadingBase />
      ) : error && page === 1 ? (
        <ErrorBase error={error} onReload={() => setLoading(true)} />
      ) : (
        <InfiniteScroll
          loading={loading}
          onLoading={() => setLoading(true)}
          hasReachedBottom={hasReachedBottom}
        >
          <View
            style={{
              paddingBottom: 20,
              paddingHorizontal: 20,
              gap: 20,
              paddingTop: 10,
            }}
          >
            {data.map((item, i) => {
              return (
                <ItemHorizontal
                  key={i}
                  imgUri={getImageThumb(item.foodPicture, 'xs')}
                  title={item.foodName}
                  subTitle={item.merchantName}
                  price={
                    Number(item.foodPrice) -
                    (Number(item.foodDiscount) / 100) * Number(item.foodPrice)
                  }
                  priceBeforeDisc={
                    Number(item.foodDiscount) > 0
                      ? Number(item.foodPrice)
                      : undefined
                  }
                  onPress={() => {
                    navigation.navigate('Merchant', {
                      params: {
                        foodId: item.foodId,
                        merchantId: item.merchantId,
                      },
                    });
                  }}
                />
              );
            })}
          </View>
        </InfiniteScroll>
      )}
    </View>
  );
}
