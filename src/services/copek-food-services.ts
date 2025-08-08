import { HOST_REST_API } from "../config";
import { FoodCollectionType, FoodType } from "../types/food-collection-types";

export const getFoodHomeCollection = async (signal: AbortSignal, city: string, location: {
  latitude: number;
  longitude: number
}): Promise<FoodCollectionType[]> => {
  const response = await fetch(
    `${HOST_REST_API}food/collection?kota=${city}&koordinat=${location.latitude},${location.longitude}`, {
      signal
    }
  );
  if (!response.ok) {
    throw new Error('Failed to load food collection');
  }

  const json = await response.json();
  return json
}

export const searchFood = async (signal: AbortSignal, search: string, cityName: string, position: {
  latitude: number;
  longitude: number;
}, page: number): Promise<FoodType[]> => {
  const response = await fetch(
    `${HOST_REST_API}food/get?cari=${search}&koordinat=${position.latitude},${position.longitude}&orderby=nearest&kota=${cityName}&page=${page}`, {
      signal
    }
  );
  if (!response.ok) {
    throw new Error('Failed to load food');
  }

  const json = await response.json();
  return json;
}