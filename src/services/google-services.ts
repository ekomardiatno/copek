import { GOOGLE_MAPS_API_KEY } from '../config';
import { PlaceType } from '../types/google-map-types';

export const getGeocode = async (
  signal: AbortSignal,
  location: {
    latitude: number;
    longitude: number;
  },
): Promise<PlaceType[]> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    {
      signal,
    },
  );
  if (!response.ok) {
    throw new Error('Failed to get geocode');
  }
  const json = await response.json();
  if (json.status !== 'OK') {
    throw new Error('Failed to get geocode');
  }

  return json.results;
};
