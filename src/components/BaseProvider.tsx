import { JSX } from 'react';
import CartProvider from './CartProvider';
import { FoodItemProvider } from './FoodItem';
import MerchantProvider from './MerchantProvider';

export default function BaseProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  return (
    <CartProvider>
      <FoodItemProvider>
        <MerchantProvider>{children}</MerchantProvider>
      </FoodItemProvider>
    </CartProvider>
  );
}
