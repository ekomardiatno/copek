import React, {
  createContext,
  JSX,
  useCallback, useEffect,
  useRef,
  useState
} from 'react';
import { getGeocode } from '../services/google-services';
import { PlaceType } from '../types/google-map-types';
import { generateCityAndRouteName } from '../utils';
import { SimpleLocationType } from '../redux/reducers/app.reducer';
import useAppSelector from '../hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { setCurrentGeocode, setSelectedGeocode } from '../redux/actions/geocode.action';

export const GeocodeContext = createContext<{
  loadingCurrentGeocode: boolean;
  setLoadingCurrentGeocode: React.Dispatch<React.SetStateAction<boolean>>;
  loadingSelectedGeocode: boolean;
  setLoadingSelectedGeocode: React.Dispatch<React.SetStateAction<boolean>>;
  currentGeocodeRequestError: Error | TypeError | null;
  selectedGeocodeRequestError: Error | TypeError | null;
  currentCityName: string;
  currentRouteName: string;
  selectedCityName: string;
  selectedRouteName: string;
}>({
  loadingCurrentGeocode: false,
  setLoadingCurrentGeocode: () => {},
  loadingSelectedGeocode: false,
  setLoadingSelectedGeocode: () => {},
  currentGeocodeRequestError: null,
  selectedGeocodeRequestError: null,
  currentCityName: '',
  currentRouteName: '',
  selectedCityName: '',
  selectedRouteName: '',
});

export default function GeocodeProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const {currentGeolocation: currentLocation, selectedLocation} = useAppSelector(state => state.geolocationReducer)
  const { currentGeocode, selectedGeocode } = useAppSelector(state => state.geocodeReducer)
  const dispatch = useDispatch()
  // const [currentGeocode, setCurrentGeocode] = useState<PlaceType[]>([]);
  // const [selectedGeocode, setSelectedGeocode] = useState<PlaceType[]>([]);
  const [loadingCurrentGeocode, setLoadingCurrentGeocode] = useState(false);
  const [loadingSelectedGeocode, setLoadingSelectedGeocode] = useState(false);
  const [currentGeocodeRequestError, setCurrentGeocodeRequestError] = useState<
    Error | TypeError | null
  >(null);
  const [selectedGeocodeRequestError, setSelectedGeocodeRequestError] =
    useState<Error | TypeError | null>(null);
  const [currentCityName, setCurrentCityName] = useState<string>('');
  const [currentRouteName, setCurrentRouteName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');
  const [selectedRouteName, setSelectedRouteName] = useState<string>('');

  useEffect(() => {
    if (currentLocation) {
      setLoadingCurrentGeocode(true);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (selectedLocation) {
      setLoadingSelectedGeocode(true);
    }
  }, [selectedLocation]);

  const handleFetchGeocode = async ({
    loading,
    location,
    setGeocode,
    setRequestError,
    setLoading,
    signal,
  }: {
    loading: boolean;
    location: SimpleLocationType | null;
    setGeocode: (geocode: PlaceType[]) => void;
    setRequestError: React.Dispatch<
      React.SetStateAction<Error | TypeError | null>
    >;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    signal?: AbortSignal;
  }) => {
    if (!loading) return;
    if (!location) return;
    setRequestError(null);
    try {
      const response = await getGeocode(location, signal);
      setGeocode(response);
    } catch (e) {
      if (e instanceof Error || e instanceof TypeError) {
        setRequestError(e);
      } else {
        setRequestError(new Error('Failed to get geocode'));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentGeocode = useCallback(
    async (signal?: AbortSignal) => {
      handleFetchGeocode({
        loading: loadingCurrentGeocode,
        location: currentLocation,
        setGeocode: (geocode: PlaceType[]) => {
          dispatch(setCurrentGeocode(geocode))
        },
        setRequestError: setCurrentGeocodeRequestError,
        setLoading: setLoadingCurrentGeocode,
        signal: signal,
      });
    },
    [currentLocation, dispatch, loadingCurrentGeocode],
  );

  const fetchSelectedGeocode = useCallback(
    async (signal?: AbortSignal) => {
      handleFetchGeocode({
        loading: loadingSelectedGeocode,
        location: selectedLocation,
        setGeocode: (geocode: PlaceType[]) => {
          dispatch(setSelectedGeocode(geocode))
        },
        setRequestError: setSelectedGeocodeRequestError,
        setLoading: setLoadingSelectedGeocode,
        signal: signal,
      });
    },
    [dispatch, loadingSelectedGeocode, selectedLocation],
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
    fetchCurrentGeocode(signal);
    fetchSelectedGeocode(signal);
  }, [fetchCurrentGeocode, fetchSelectedGeocode]);

  useEffect(() => {
    if (currentGeocode.length > 0) {
      const cityAndRouteName = generateCityAndRouteName(currentGeocode);
      setCurrentRouteName(cityAndRouteName.routeName);
      setCurrentCityName(cityAndRouteName.cityName);
    }
  }, [currentGeocode]);

  useEffect(() => {
    if (selectedGeocode.length > 0) {
      const cityAndRouteName = generateCityAndRouteName(selectedGeocode);
      setSelectedRouteName(cityAndRouteName.routeName);
      setSelectedCityName(cityAndRouteName.cityName);
    }
  }, [selectedGeocode]);

  return (
    <GeocodeContext.Provider
      value={{
        loadingCurrentGeocode,
        setLoadingCurrentGeocode,
        loadingSelectedGeocode,
        setLoadingSelectedGeocode,
        currentGeocodeRequestError,
        selectedGeocodeRequestError,
        currentCityName,
        currentRouteName,
        selectedCityName,
        selectedRouteName,
      }}
    >
      {children}
    </GeocodeContext.Provider>
  );
}
