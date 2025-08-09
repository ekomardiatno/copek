/* eslint-disable react-native/no-inline-styles */
import { JSX, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleHeader from '../components/SimpleHeader';
import InfiniteScroll from '../components/InfiniteScroll';
import LoadingBase from '../components/LoadingBase';
import ErrorBase from '../components/ErrorBase';
import ItemHorizontal from '../components/ItemHorizontal';
import { MerchantType } from '../types/food-collection-types';
import getImageThumb from '../utils/getImageThumb';
import { searchMerchant } from '../services/copek-food-services';
import { CurrentGeocodeLocationContext } from '../components/CurrentGeocodeLocationProvider';
import { SimpleLocationType } from '../redux/reducers/app.reducer';
import parsingError from '../utils/parsingError';
import useAppSelector from '../hooks/useAppSelector';
import { useRoute } from '@react-navigation/native';
import { AppRouteProp } from '../types/navigation';

export default function ListMerchantScreen(): JSX.Element {
  const route = useRoute<AppRouteProp<'List Menu'>>()
  const params = route.params.params
  const { cityName } = useContext(CurrentGeocodeLocationContext);
  const currentLocation = useAppSelector<SimpleLocationType | null>(
    state => state.appReducer.currentLocation,
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
      if (!cityName) return;
      if (!loading) return;
      setError(null);
      try {
        const result = await searchMerchant(
          '',
          cityName,
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
    [hasReachedBottom, currentLocation, cityName, loading, page, params],
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
                    imgUri={getImageThumb(item.merchantPicture, 'xs')}
                    title={item.merchantName}
                    subTitle={item.merchantDetails}
                    distance={Number(item.merchantDistance)}
                  />
                );
              })}
            </View>
          </InfiniteScroll>
        )}
    </View>
  );
}
