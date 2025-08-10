import { MerchantDetailsType } from "../../types/merchant-types";
import { CartType } from "../reducers/cart.reducer";
import { SET_CART, SET_MERCHANT_ON_CART } from "../types";

export const setCart = (cart: CartType[]) => ({
  type: SET_CART,
  payload: cart,
});

export const setMerchantOnCart = (cart: MerchantDetailsType | null) => ({
  type: SET_MERCHANT_ON_CART,
  payload: cart,
});