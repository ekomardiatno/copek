import { MerchantType } from './merchant-types';

export type FoodType = {
  foodId: string;
  foodName: string;
  foodPrice: string | number;
  foodDiscount: string | number;
  foodPicture: string;
  merchantId: string;
  merchantName: string;
  merchantLatitude: string | number;
  merchantLongitude: string | number;
  merchantDistance: string | number;
};

export type FoodCollectionType = {
  title: [string, string];
  style: 'sliding' | 'list';
  more: 'rand' | 'nearest';
  category: 'merchant' | 'food';
  data: (MerchantType & FoodType)[];
};

export type FoodMerchantType = {
  foodId: string;
  merchantId: string;
  foodPicture: string;
  foodName: string;
  foodPrice: string | number;
  foodDiscount: string | number;
  foodDetails: string;
  is_deleted: '0' | '1';
  is_active: '0' | '1';
};
