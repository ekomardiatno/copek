import { GOOGLE_MAPS_API_KEY } from '../config';
import { PlacesTextSearchResponseType, PlaceType } from '../types/google-map-types';
import { SimpleLocationType } from '../redux/reducers/app.reducer';
import Config from 'react-native-config';

export const getGeocode = async (
  location: {
    latitude: number;
    longitude: number;
  },
  signal?: AbortSignal,
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
    throw new Error(json.error_message || 'Failed to get geocode');
  }

  return json.results;
};

export async function searchPlace({location, query, pageToken}: {
  location?: SimpleLocationType;
  query: string;
  pageToken?: string
}, signal?: AbortSignal): Promise<PlacesTextSearchResponseType> {
  const searchParams = new URLSearchParams()
  if(pageToken) {
    searchParams.append('pagetoken', pageToken)
  } else {
    searchParams.append('query', query)
    if(location) {
      searchParams.append('location', `${location.latitude},${location.longitude}`)
    }
  }
  if(Config.GOOGLE_MAPS_API_KEY) {
    searchParams.append('key', Config.GOOGLE_MAPS_API_KEY)
  }
  searchParams.append('radius', '20000')
  const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?${searchParams}`, {
    signal
  })

  if (!response.ok) {
    throw new Error('Failed to find place');
  }
  const json = await response.json();

  return json;
}
