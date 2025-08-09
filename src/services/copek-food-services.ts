import { WEB_API_URL } from "../config";
import { FoodCollectionType, FoodType, MerchantType } from "../types/food-collection-types";

export const getFoodHomeCollection = async (
  city: string,
  location: {
    latitude: number;
    longitude: number;
  },
  signal?: AbortSignal
): Promise<FoodCollectionType[]> => {
  const response = await fetch(
    `${WEB_API_URL}food/collection?kota=${city}&koordinat=${location.latitude},${location.longitude}`,
    {
      signal,
    },
  );
  if (!response.ok) {
    throw new Error('Failed to load food collection');
  }

  const json = await response.json();
  return json;
};

export const searchFood = async (
  search: string,
  cityName: string,
  position: {
    latitude: number;
    longitude: number;
  },
  page?: number,
  orderBy?: 'nearest' | 'rand',
  signal?: AbortSignal,
): Promise<FoodType[]> => {
  const response = await fetch(
    `${WEB_API_URL}food/get?cari=${search}&koordinat=${position.latitude},${position.longitude}&orderby=${orderBy || 'nearest'}&kota=${cityName}&page=${page || 1}`,
    {
      signal,
    },
  );
  if (!response.ok) {
    throw new Error('Failed to load food');
  }

  const json = await response.json();
  return json;
};

export const searchMerchant = async (
  search: string,
  cityName: string,
  position: {
    latitude: number;
    longitude: number;
  },
  page?: number,
  orderBy?: 'nearest' | 'rand',
  signal?: AbortSignal,
): Promise<MerchantType[]> => {
  const response = await fetch(
    `${WEB_API_URL}merchant/get?cari=${search}&koordinat=${position.latitude},${position.longitude}&orderby=${orderBy || 'nearest'}&kota=${cityName}&page=${page || 1}`,
    {
      signal,
    },
  );
  if (!response.ok) {
    throw new Error('Failed to load food');
  }

  const json = await response.json();
  return json;
};