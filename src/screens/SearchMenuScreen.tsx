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
import { themeColors } from '../constants';
import Input from '../components/Input';
import { searchFood } from '../services/copek-food-services';
import { CurrentGeocodeLocationContext } from '../components/CurrentGeocodeLocationProvider';
import { useSelector } from 'react-redux';
import { CurrentLocationStateType } from '../redux/reducers/app.reducer';
import { FoodType } from '../types/food-collection-types';
import ItemHorizontal from './FoodScreen/ItemHorizontal';
import getImageThumb from '../utils/getImageThumb';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';
import SimpleHeader from '../components/SimpleHeader';
export default function SearchMenuScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const { cityName } = useContext(CurrentGeocodeLocationContext);
  const currentLocation = useSelector<any>(
    state => state?.appReducer?.currentLocation,
  ) as CurrentLocationStateType | null;
  const timeoutFetch = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<FoodType[]>([]);
  const [error, setError] = useState<Error | TypeError | null>(null);

  const handleSearch = (text: string) => {
    if (timeoutFetch.current) clearTimeout(timeoutFetch.current);
    setSearch(text);
  };

  useEffect(() => {
    if (search) {
      timeoutFetch.current = setTimeout(() => {
        setLoading(true);
        setPage(1);
      }, 800);
    } else {
      setLoading(false);
    }
  }, [search]);

  const fetchSearch = useCallback(
    async (signal?: AbortSignal) => {
      if (!loading) return;
      if (!currentLocation) return;
      if (!cityName) return;
      setError(null);
      try {
        const result = await searchFood(
          search,
          cityName,
          currentLocation,
          page,
          signal,
        );
        console.log(result);
        setData(result);
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
    [cityName, search, currentLocation, page, loading],
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
          paddingBottom: 20,
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
          <TouchableHighlight onPress={() => setLoading(true)}>
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
        <ScrollView>
          <View style={{ gap: 20, paddingHorizontal: 20 }}>
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
          </View>
        </ScrollView>
      )}
    </View>
  );
}
