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

export type MerchantDetailsType = Omit<MerchantType, 'merchantDistance'> & {
  merchantOwner: 'Sempoerna';
  merchantPhone: '08123444124';
  merchantEmail: 'wns934827641@email.com';
  ocsOpen: '00:00:00';
  ocsClose: '23:59:00';
  merchantOcs: 'opened';
};