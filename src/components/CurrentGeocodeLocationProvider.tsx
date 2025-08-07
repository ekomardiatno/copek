import { JSX, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CurrentGeocodeLocationStateType,
  CurrentLocationStateType,
} from '../redux/reducers/app.reducer';
import { GOOGLE_MAPS_API_KEY } from '../config';
import { setCurrentGeocodeLocation } from '../redux/actions/app.action';

export default function CurrentGeocodeLocationProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const location = useSelector<any>(
    state => state?.appReducer?.currentLocation || null,
  ) as CurrentLocationStateType;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | TypeError | null>(null);
  const dispatch = useDispatch()

  useEffect(() => {
    if (location) {
      setLoading(true)
    }
  }, [location]);

  const fetchGeocode = useCallback(async () => {
    if (!loading) return;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      if (!response.ok) {
        throw new Error('Failed to get geocode');
      }
      const json = await response.json();
      if(json.status === 'OK') {
        dispatch(setCurrentGeocodeLocation(json.results))
      } else {
        throw new Error('Failed to get geocode');
      }
    } catch (e) {
      if (e instanceof Error || e instanceof TypeError) {
        setError(e)
      } else {
        setError(new Error('Failed to get geocode'));
      }
    } finally {
      setLoading(false)
    }
  }, [loading, location]);

  useEffect(() => {
    fetchGeocode();
  }, [fetchGeocode]);
  return children;
}
