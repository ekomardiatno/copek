/* eslint-disable react-native/no-inline-styles */
import { createContext, JSX, useCallback, useEffect, useState } from 'react';
import { CartType } from '../../redux/reducers/cart.reducer';
import CartItemModal from './CartItemModal';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAppSelector from '../../hooks/useAppSelector';
import { themeColors } from '../../constants';
import modCurrency from '../../utils/modCurrency';
import Icon from '../Icon';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import useAppNavigation from '../../hooks/useAppNavigation';
import Pressable from '../Pressable';

const initialSharedValue = {
  bottom: -150,
};

type CartContextType = {
  isOpenCartItemModal: boolean;
  selectedCartItem: CartType | null;
  setIsOpenCartItemModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCartItem: React.Dispatch<React.SetStateAction<CartType | null>>;
  showProccedToCheckoutButton: () => void;
  hideProccedToCheckoutButton: () => void;
};

export const CartContext = createContext<CartContextType>({
  isOpenCartItemModal: false,
  setIsOpenCartItemModal: () => {},
  selectedCartItem: null,
  setSelectedCartItem: () => {},
  showProccedToCheckoutButton: () => {},
  hideProccedToCheckoutButton: () => {},
});

export default function CartProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  const navigation = useAppNavigation();
  const cart = useAppSelector(state => state.cartReducer.cart);
  const merchantOnCart = useAppSelector(
    state => state.cartReducer.merchantOnCart,
  );
  const [isOpenCartItemModal, setIsOpenCartItemModal] =
    useState<boolean>(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartType | null>(
    null,
  );
  const insets = useSafeAreaInsets();

  const itemCount = cart.reduce((total, item) => {
    return total + item.qty;
  }, 0);

  const totalPrice = cart.reduce((total, item) => {
    return total + item.qty * (Number(item.foodPrice) - Number(item.foodDiscount) / 100 * Number(item.foodPrice));
  }, 0);

  const bottom = useSharedValue(initialSharedValue.bottom);

  const showProccedToCheckoutButton = () => {
    if (cart.length > 0) {
      bottom.value = withSpring(0);
    }
  };
  
  const hideProccedToCheckoutButton = useCallback(() => {
    bottom.value = withSpring(-150);
  }, [bottom]);

  const currentScreen = navigation.getState().routes.at(-1)?.name;

  useEffect(() => {
    if (!['Food', 'Merchant'].includes(currentScreen as string)) {
      hideProccedToCheckoutButton()
    } else {
      if (cart.length > 0) {
        bottom.value = withSpring(0);
      } else {
        bottom.value = withSpring(initialSharedValue.bottom);
      }
    }
  }, [bottom, cart.length, hideProccedToCheckoutButton, currentScreen]);

  return (
    <CartContext.Provider
      value={{
        isOpenCartItemModal,
        setIsOpenCartItemModal,
        selectedCartItem,
        setSelectedCartItem,
        showProccedToCheckoutButton,
        hideProccedToCheckoutButton,
      }}
    >
      {children}
      <CartItemModal />
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: bottom,
            left: 0,
            right: 0,
            zIndex: 100,
            marginBottom: insets.bottom
          },
        ]}
      >
        <View style={{ margin: 20, marginHorizontal: 15 }}>
          <Pressable
            onPress={() => {
              navigation.navigate('FoodOrder')
            }}
            underlayColor={themeColors.primary}
            style={{
              backgroundColor: themeColors.primary,
              paddingHorizontal: 18,
              paddingVertical: 6,
              borderRadius: 20,
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: themeColors.white,
                    fontSize: 13,
                  }}
                >{`${itemCount} ${itemCount > 1 ? 'items' : 'item'}`}</Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: 300,
                    fontSize: 11,
                    color: themeColors.white,
                  }}
                >
                  Pengiriman dari {merchantOnCart?.merchantName}
                </Text>
              </View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}
              >
                <Text style={{ color: themeColors.white, fontWeight: 'bold' }}>
                  {modCurrency(totalPrice)}
                </Text>
                <Icon name="bag-shopping" color={themeColors.white} size={17} />
              </View>
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </CartContext.Provider>
  );
}
