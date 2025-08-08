import React, {
  createContext,
  JSX,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  CurrentLocationStateType,
} from '../redux/reducers/app.reducer';
import { getGeocode } from '../services/google-services';
import { PlaceType } from '../types/google-map-types';

export const CurrentGeocodeLocationContext = createContext<{
  currentGeocodeLocation: PlaceType[];
  setCurrentGeocodeLocation: React.Dispatch<
    React.SetStateAction<PlaceType[]>
  >;
  loadingCurrentGeocodeLocation: boolean;
  setLoadingCurrentGeocodeLocation: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  currentGeocodeLocationRequestError: Error | TypeError | null;
  setCurrentGeocodeLocationRequestError: React.Dispatch<
    React.SetStateAction<Error | TypeError | null>
  >;
}>({
  currentGeocodeLocation: [],
  setCurrentGeocodeLocation: () => {},
  loadingCurrentGeocodeLocation: false,
  setLoadingCurrentGeocodeLocation: () => {},
  currentGeocodeLocationRequestError: null,
  setCurrentGeocodeLocationRequestError: () => {},
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

  useEffect(() => {
    if (location) {
      setLoadingCurrentGeocodeLocation(true);
    }
  }, [location]);

  const fetchGeocode = useCallback(
    async (signal: AbortSignal) => {
      setCurrentGeocodeLocationRequestError(null);
      try {
        const response = await getGeocode(signal, location);
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
    [location],
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (loadingCurrentGeocodeLocation) {
      fetchGeocode(signal);
      return () => {
        controller.abort();
      };
    } else {
      controller.abort();
    }
  }, [loadingCurrentGeocodeLocation, fetchGeocode]);

  return (
    <CurrentGeocodeLocationContext.Provider
      value={{
        currentGeocodeLocation,
        setCurrentGeocodeLocation,
        loadingCurrentGeocodeLocation,
        setLoadingCurrentGeocodeLocation,
        currentGeocodeLocationRequestError,
        setCurrentGeocodeLocationRequestError,
      }}
    >
      {children}
    </CurrentGeocodeLocationContext.Provider>
  );
}
