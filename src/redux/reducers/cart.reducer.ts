import { SET_CART, SET_MERCHANT_ON_CART } from '../types';
import { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from '../persistConfig';
import { FoodMerchantType } from '../../types/food-collection-types';
import { MerchantDetailsType } from '../../types/merchant-types';

export type CartType = FoodMerchantType & {
  note: string;
  qty: number
}

const initialState: {
  cart: CartType[];
  merchantOnCart: MerchantDetailsType | null
} = {
  cart: [],
  merchantOnCart: null
};

const cartReducer = (state = initialState, action: PayloadAction<any>) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CART:
      return {
        ...state,
        cart: payload as CartType[],
      };
    case SET_MERCHANT_ON_CART:
      return {
        ...state,
        merchantOnCart: payload as MerchantDetailsType | null,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, cartReducer);
