/* eslint-disable react/self-closing-comp */
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
import { CurrentGeocodeLocationContext } from '../components/CurrentGeocodeLocationProvider';
import { useSelector } from 'react-redux';
import { SimpleLocationType } from '../redux/reducers/app.reducer';
import { searchFood } from '../services/copek-food-services';
import ItemHorizontal from './FoodScreen/ItemHorizontal';
import getImageThumb from '../utils/getImageThumb';
import LoadingBase from '../components/LoadingBase';
import ErrorBase from '../components/ErrorBase';

export default function ListMenuScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const { cityName } = useContext(CurrentGeocodeLocationContext);
  const currentLocation = useSelector<any>(
    state => state?.appReducer?.currentLocation,
  ) as SimpleLocationType | null;
  const [loading, setLoading] = useState(false);
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
      if (!cityName) return;
      if (!loading) return;
      setError(null);
      try {
        const result = await searchFood(
          '',
          cityName,
          currentLocation,
          page,
          'rand',
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
    [hasReachedBottom, currentLocation, cityName, loading, page],
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
              />
            );
          })}
        </InfiniteScroll>
      )}
    </View>
  );
}
