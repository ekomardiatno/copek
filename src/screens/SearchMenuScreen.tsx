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
import { ROUNDED_SIZE, themeColors } from '../constants';
import Input from '../components/Input';
import { searchFood } from '../services/copek-food-services';
import { GeocodeContext } from '../components/GeocodeProvider';
import { FoodType } from '../types/food-collection-types';
import ItemHorizontal from '../components/ItemHorizontal';
import getImageThumb from '../utils/getImageThumb';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';
import SimpleHeader from '../components/SimpleHeader';
import InfiniteScroll from '../components/InfiniteScroll';
import useAppNavigation from '../hooks/useAppNavigation';
import Pressable from '../components/Pressable';
import useAppSelector from '../hooks/useAppSelector';
export default function SearchMenuScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const { currentCityName } = useContext(GeocodeContext);
  const { currentGeolocation: currentLocation } = useAppSelector(
    state => state.geolocationReducer,
  );
  const navigation = useAppNavigation();
  const timeoutFetch = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<FoodType[]>([]);
  const [error, setError] = useState<Error | TypeError | null>(null);
  const [isAllLoaded, setIsAllLoadedEnd] = useState<boolean>(false);

  const handleSearch = (text: string) => {
    if (timeoutFetch.current) clearTimeout(timeoutFetch.current);
    setSearch(text);
  };

  useEffect(() => {
    if (search) {
      timeoutFetch.current = setTimeout(() => {
        setLoading(true);
        setPage(1);
        setIsAllLoadedEnd(false);
        setData([]);
      }, 800);
    } else {
      setLoading(false);
    }
  }, [search]);

  const fetchSearch = useCallback(
    async (signal?: AbortSignal) => {
      if (isAllLoaded) {
        setLoading(false);
        return;
      }
      if (!loading) return;
      if (!currentLocation) return;
      if (!currentCityName) return;
      setError(null);
      try {
        const result = await searchFood(
          search,
          currentCityName,
          currentLocation,
          page,
          'nearest',
          signal,
        );
        if (result.length === 0) {
          setIsAllLoadedEnd(true);
        } else {
          setPage(p => p + 1);
        }
        setData(prev => [...prev, ...result]);
      } catch (e) {
        const catchError =
          e instanceof Error || e instanceof TypeError
            ? e
            : new Error('Failed to load food collection');
        if (catchError.name !== 'AbortError') setError(catchError);
      } finally {
        setLoading(false);
      }
    },
    [currentCityName, search, currentLocation, page, loading, isAllLoaded],
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
    fetchSearch(signal);
  }, [fetchSearch]);

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <SimpleHeader title="Mau makan apa hari ini?" />
      <View
        style={{
          backgroundColor: themeColors.white,
          paddingBottom: 15,
          marginHorizontal: 20,
        }}
      >
        <Input
          iconName="magnifying-glass"
          autoFocus
          onChangeText={handleSearch}
          placeholder="Cari disini"
        />
      </View>
      {loading && page === 1 ? (
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
      ) : error && page === 1 ? (
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
            {error?.message || 'Terjadi kesalahan'}
          </Text>
          <Pressable onPress={() => setLoading(true)}>
            <View
              style={{
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: themeColors.red,
                borderRadius: ROUNDED_SIZE,
              }}
            >
              <Text style={{ color: themeColors.white, textAlign: 'center' }}>
                Coba lagi
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <InfiniteScroll
          loading={loading}
          onLoading={() => setLoading(true)}
          hasReachedBottom={isAllLoaded}
        >
          <View style={{ gap: 20, paddingHorizontal: 20, paddingBottom: 20 }}>
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
                        merchantId: item.merchantId,
                        foodId: item.foodId,
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
