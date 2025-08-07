export type AddressComponentType = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type PlaceOpeningHoursPeriodDetailType = {
  day: number;
  time: string;
  date?: string;
  truncated?: boolean;
};

export type PlaceOpeningHoursPeriodType = {
  open: PlaceOpeningHoursPeriodDetailType;
  close?: PlaceOpeningHoursPeriodDetailType;
};

export type PlaceSpecialDayType = {
  date?: string;
  exceptional_hours?: boolean;
};

export type PlaceOpeningHoursType = {
  open_now?: boolean;
  periods?: PlaceOpeningHoursPeriodType[];
  special_days?: PlaceSpecialDayType[];
  type?: string;
  weekday_text?: string[];
};

export type PlaceEditorialSummaryType = {
  language?: string;
  overview?: string;
};

export type LatLngLiteralType = {
  lat: number;
  lng: number;
};

export type GeometryType = {
  location: LatLngLiteralType;
  viewport: {
    northeast: LatLngLiteralType;
    southwest: LatLngLiteralType;
  };
};

export type PlacePhotoType = {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
};

export type PlusCodeType = {
  global_code: string;
  compound_code?: string;
};

export type PlaceReviewType = {
  author_name: string;
  rating: number;
  relative_time_description: string;
  time: number;
  author_url?: string;
  language?: string;
  original_language?: string;
  profile_photo_url?: string;
  text?: string;
  translated?: boolean;
};

export type PlaceType = {
  address_components?: AddressComponentType[];
  adr_address?: string;
  business_status?: string;
  curbside_pickup?: boolean;
  current_opening_hours?: PlaceOpeningHoursType;
  delivery?: boolean;
  dine_in?: boolean;
  editorial_summary?: PlaceEditorialSummaryType;
  formatted_address?: string;
  formatted_phone_number?: string;
  geometry?: GeometryType;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  international_phone_number?: string;
  name?: string;
  opening_hours?: PlaceOpeningHoursType;
  photos?: PlacePhotoType[];
  place_id?: string;
  plus_code?: PlusCodeType;
  price_level?: number; // 0 Free 1 Inexpensive 2 Moderate 3 Expensive 4 Very Expensive
  rating?: number; // 1.0 to 5.0
  reservable?: boolean;
  reviews?: PlaceReviewType[];
  secondary_opening_hours?: PlaceOpeningHoursType[];
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_wine?: boolean;
  takeout?: boolean;
  types?: string[];
  url?: string;
  user_ratings_total?: number;
  utc_offset?: number;
  vicinity?: string;
  website?: string;
  wheelchair_accessible_entrance?: boolean;
};

export type PlacesSearchStatusType =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'INVALID_REQUEST'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'UNKNOWN_ERROR';

export type PlacesTextSearchResponseType = {
  html_attributions: string[];
  results: PlaceType[];
  status: PlacesSearchStatusType;
  error_message?: string;
  info_messages?: string[];
  next_page_token?: string;
};
