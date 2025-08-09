import React, {
  createContext,
  JSX,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { CurrentLocationStateType } from '../redux/reducers/app.reducer';
import { getGeocode } from '../services/google-services';
import { PlaceType } from '../types/google-map-types';

export const CurrentGeocodeLocationContext = createContext<{
  currentGeocodeLocation: PlaceType[];
  setCurrentGeocodeLocation: React.Dispatch<React.SetStateAction<PlaceType[]>>;
  loadingCurrentGeocodeLocation: boolean;
  setLoadingCurrentGeocodeLocation: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  currentGeocodeLocationRequestError: Error | TypeError | null;
  setCurrentGeocodeLocationRequestError: React.Dispatch<
    React.SetStateAction<Error | TypeError | null>
  >;
  cityName: string;
}>({
  currentGeocodeLocation: [],
  setCurrentGeocodeLocation: () => {},
  loadingCurrentGeocodeLocation: false,
  setLoadingCurrentGeocodeLocation: () => {},
  currentGeocodeLocationRequestError: null,
  setCurrentGeocodeLocationRequestError: () => {},
  cityName: '',
});

export default function CurrentGeocodeLocationProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const location = useSelector<any>(
    state => state?.appReducer?.currentLocation || null,
  ) as CurrentLocationStateType;
  const [currentGeocodeLocation, setCurrentGeocodeLocation] = useState<
    PlaceType[]
  >([]);
  const [loadingCurrentGeocodeLocation, setLoadingCurrentGeocodeLocation] =
    useState(false);
  const [
    currentGeocodeLocationRequestError,
    setCurrentGeocodeLocationRequestError,
  ] = useState<Error | TypeError | null>(null);
  const [cityName, setCityName] = useState<string>('');

  useEffect(() => {
    if (location) {
      setLoadingCurrentGeocodeLocation(true);
    }
  }, [location]);

  const fetchGeocode = useCallback(
    async (signal?: AbortSignal) => {
      if (!loadingCurrentGeocodeLocation) return null;
      setCurrentGeocodeLocationRequestError(null);
      try {
        const response = await getGeocode(location, signal);
        setCurrentGeocodeLocation(response);
      } catch (e) {
        if (e instanceof Error || e instanceof TypeError) {
          setCurrentGeocodeLocationRequestError(e);
        } else {
          setCurrentGeocodeLocationRequestError(
            new Error('Failed to get geocode'),
          );
        }
      } finally {
        setLoadingCurrentGeocodeLocation(false);
      }
    },
    [location, loadingCurrentGeocodeLocation],
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
    fetchGeocode(signal);
  }, [fetchGeocode]);

  useEffect(() => {
    if (currentGeocodeLocation.length > 0) {
      const findCity = currentGeocodeLocation.find(row =>
        row.types?.includes('administrative_area_level_2'),
      );
      if (findCity) {
        const city = findCity.address_components?.find(row =>
          row.types?.includes('administrative_area_level_2'),
        );
        setCityName(city?.short_name || '');
      } else {
        const city = currentGeocodeLocation[0].address_components?.find(row =>
          row.types?.includes('administrative_area_level_2'),
        );
        setCityName(city?.short_name || '');
      }
    }
  }, [currentGeocodeLocation]);

  return (
    <CurrentGeocodeLocationContext.Provider
      value={{
        currentGeocodeLocation,
        setCurrentGeocodeLocation,
        loadingCurrentGeocodeLocation,
        setLoadingCurrentGeocodeLocation,
        currentGeocodeLocationRequestError,
        setCurrentGeocodeLocationRequestError,
        cityName,
      }}
    >
      {children}
    </CurrentGeocodeLocationContext.Provider>
  );
}
