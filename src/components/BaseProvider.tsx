import { JSX } from 'react';
import CartProvider from './CartProvider';
import { FoodItemProvider } from './FoodItem';
import MerchantProvider from './MerchantProvider';
import GeolocationProvider from './GeolocationProvider';
import GeocodeProvider from './GeocodeProvider';

export default function BaseProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  return (
    <GeolocationProvider>
      <GeocodeProvider>
        <CartProvider>
          <FoodItemProvider>
            <MerchantProvider>{children}</MerchantProvider>
          </FoodItemProvider>
        </CartProvider>
      </GeocodeProvider>
    </GeolocationProvider>
  );
}
