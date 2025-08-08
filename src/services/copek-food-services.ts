import { HOST_REST_API } from "../config";
import { FoodCollectionType } from "../types/food-collection-types";

export const getFoodHomeCollection = async (signal: AbortSignal, city: string, location: {
  latitude: number;
  longitude: number
}): Promise<FoodCollectionType[]> => {
  const response = await fetch(
    `${HOST_REST_API}food/collection?kota=${city}&koordinat=${location.latitude},${location.longitude}`,
  );
  if (!response.ok) {
    throw new Error('Failed to load food collection');
  }

  const json = await response.json();
  return json
}