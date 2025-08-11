/* eslint-disable react-native/no-inline-styles */
import { JSX, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleHeader from '../components/SimpleHeader';
import InfiniteScroll from '../components/InfiniteScroll';
import LoadingBase from '../components/LoadingBase';
import ErrorBase from '../components/ErrorBase';
import ItemHorizontal from '../components/ItemHorizontal';
import getImageThumb from '../utils/getImageThumb';
import { searchMerchant } from '../services/copek-food-services';
import { GeocodeContext } from '../components/GeocodeProvider';
import parsingError from '../utils/parsingError';
import { useRoute } from '@react-navigation/native';
import { AppRouteProp } from '../types/navigation';
import { MerchantType } from '../types/merchant-types';
import useAppNavigation from '../hooks/useAppNavigation';
import useAppSelector from '../hooks/useAppSelector';

export default function ListMerchantScreen(): JSX.Element {
  const route = useRoute<AppRouteProp<'List Menu'>>()
  const navigation = useAppNavigation();
  const params = route.params.params
  const { currentCityName } = useContext(GeocodeContext);
  const { currentGeolocation: currentLocation } = useAppSelector(
    state => state.geolocationReducer,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | TypeError | null>(null);
  const [data, setData] = useState<MerchantType[]>([]);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMerchant = useCallback(
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
        const result = await searchMerchant(
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
      fetchMerchant(signal);
    }, [fetchMerchant]);

  return (
    <View style={{ flex: 1, paddingBottom: useSafeAreaInsets().bottom }}>
      <SimpleHeader title="Daftar Pedagang" />
        {loading && page === 1 ? (
          <LoadingBase />
        ) : error && page === 1 ? (
          <ErrorBase error={error} onReload={() => setLoading(true)} />
        ) : (
          <InfiniteScroll
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
                    imgUri={getImageThumb(item.merchantPicture, 'xs')}
                    title={item.merchantName}
                    subTitle={item.merchantDetails}
                    distance={Number(item.merchantDistance)}
                    onPress={() => {
                      navigation.navigate('Merchant', {
                        params: {
                          merchantId: item.merchantId
                        }
                      })
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
