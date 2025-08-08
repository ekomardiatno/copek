export type MerchantType = {
  merchantId: string;
  merchantName: string;
  merchantLatitude: string | number;
  merchantLongitude: string | number;
  merchantAddress: string;
  merchantDetails: string;
  merchantPicture: string;
  merchantDistance: string | number;
};

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
