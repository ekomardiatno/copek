import { JSX } from 'react';
import CartProvider from './CartProvider';
import { FoodItemOnMerchantProvider } from './FoodItemOnMerchant';
import MerchantProvider from './MerchantProvider';

export default function BaseProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  return (
    <CartProvider>
      <FoodItemOnMerchantProvider>
        <MerchantProvider>{children}</MerchantProvider>
      </FoodItemOnMerchantProvider>
    </CartProvider>
  );
}
