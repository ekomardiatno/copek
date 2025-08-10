/* eslint-disable react-native/no-inline-styles */
import {
  createContext,
  JSX,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FoodMerchantType } from '../types/food-collection-types';
import { Image, Text, View } from 'react-native';
import { themeColors } from '../constants';
import modCurrency from '../utils/modCurrency';
import getImageThumb from '../utils/getImageThumb';
import { useDispatch } from 'react-redux';
import useAppSelector from '../hooks/useAppSelector';
import { CartType } from '../redux/reducers/cart.reducer';
import { CartContext } from './CartProvider';
import { setCart, setMerchantOnCart } from '../redux/actions/cart.action';
import Modal from './Modal';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Button from './Button';
import { MerchantContext } from './MerchantProvider';
import Icon from './Icon';
import Pressable from './Pressable';

export const FoodItemOnMerchantContext = createContext<{
  foodIdToPreview: string | null;
  setFoodIdToPreview: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  foodIdToPreview: null,
  setFoodIdToPreview: () => {},
});

export function FoodItemOnMerchantProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  const [foodIdToPreview, setFoodIdToPreview] = useState<string | null>(null);
  return (
    <FoodItemOnMerchantContext.Provider
      value={{ foodIdToPreview, setFoodIdToPreview }}
    >
      {children}
    </FoodItemOnMerchantContext.Provider>
  );
}

export default function FoodItemOnMerchant({
  item,
}: {
  item: FoodMerchantType;
}): JSX.Element {
  const dispatch = useDispatch();
  const frame = useSafeAreaFrame();
  const cart = useAppSelector<CartType[]>(state => state.cartReducer.cart);
  const cartItem = cart.find(r => r.foodId === item.foodId);
  const { setIsOpenCartItemModal, setSelectedCartItem } =
    useContext(CartContext);
  const { setFoodIdToPreview, foodIdToPreview } = useContext(
    FoodItemOnMerchantContext,
  );
  const [isPreviewOpened, setIsPreviewOpened] = useState(false);
  const { merchantIsBeingViewed } = useContext(MerchantContext);
  const merchantOnCart = useAppSelector(
    state => state.cartReducer.merchantOnCart,
  );
  const [showPromptConfirmation, setShowPromptConfirmation] =
    useState<boolean>(false);

  useEffect(() => {
    if (foodIdToPreview === item.foodId) {
      setIsPreviewOpened(true);
    }
  }, [foodIdToPreview, item]);

  const handleChangeMerchant = useCallback(() => {
    if (!merchantIsBeingViewed && item) return;
    dispatch(setMerchantOnCart(merchantIsBeingViewed));
    dispatch(
      setCart([
        {
          ...item,
          note: '',
          qty: 1,
        },
      ]),
    );
    setShowPromptConfirmation(false);
  }, [dispatch, item, merchantIsBeingViewed]);

  const handleAddToCart = useCallback(() => {
    if (!merchantIsBeingViewed) return;
    if (merchantOnCart && cart.length) {
      if (merchantOnCart.merchantId !== merchantIsBeingViewed.merchantId) {
        setShowPromptConfirmation(true);
        return;
      }
    }
    if (cartItem) {
      setSelectedCartItem(cartItem);
      setIsOpenCartItemModal(true);
      return;
    }
    dispatch(setMerchantOnCart(merchantIsBeingViewed));
    dispatch(
      setCart([
        ...cart,
        {
          ...item,
          note: '',
          qty: 1,
        },
      ]),
    );
  }, [
    cart,
    cartItem,
    dispatch,
    item,
    merchantIsBeingViewed,
    merchantOnCart,
    setIsOpenCartItemModal,
    setSelectedCartItem,
  ]);

  return (
    <>
      <Pressable
        activeScale={1}
        key={item.foodId}
        onPress={() => {
          setFoodIdToPreview(item.foodId);
        }}
      >
        <View style={{ backgroundColor: themeColors.white }}>
          <View
            style={{
              flexDirection: 'row',
              position: 'relative',
              paddingVertical: 20,
              paddingBottom: 30,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontWeight: 'bold', marginBottom: 6 }}
                numberOfLines={2}
              >
                {item.foodName}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  {modCurrency(
                    Number(item.foodPrice) -
                      (Number(item.foodDiscount) / 100) *
                        Number(item.foodPrice),
                  )}
                </Text>
                {Number(item.foodDiscount) > 0 && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: themeColors.textMuted,
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    }}
                  >
                    {modCurrency(Number(item.foodPrice))}
                  </Text>
                )}
              </View>
            </View>
            <View style={{ position: 'relative' }}>
              <View
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: themeColors.grayLighter,
                  borderRadius: 10,
                  elevation: 2,
                }}
              >
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                  }}
                  source={{
                    uri: getImageThumb(item.foodPicture, 'sm'),
                  }}
                />
              </View>
              {Number(item.foodDiscount) > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 5,
                    left: -4.5,
                    width: 55,
                    height: 24,
                  }}
                >
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                    source={require('../assets/images/ribbon.png')}
                  />
                </View>
              )}
              <View
                style={{
                  position: 'absolute',
                  bottom: -32 + 10,
                  left: 10,
                  right: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    handleAddToCart();
                  }}
                  style={{ borderRadius: 32 / 2, elevation: 1 }}
                >
                  <View
                    style={{
                      height: 32,
                      borderRadius: 32 / 2,
                      overflow: 'hidden',
                      paddingHorizontal: 8,
                      borderColor: themeColors.secondary,
                      borderWidth: 1,
                      backgroundColor: cartItem
                        ? themeColors.secondary
                        : themeColors.white,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: cartItem
                          ? themeColors.white
                          : themeColors.secondary,
                        fontSize: 13,
                      }}
                    >
                      {cartItem
                        ? `${cartItem.qty} ${
                            cartItem.qty > 1 ? 'items' : 'item'
                          }`
                        : 'Tambah'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
      <Modal
        visible={isPreviewOpened}
        onClose={() => {
          setFoodIdToPreview(null);
          setIsPreviewOpened(false);
        }}
      >
        <View
          style={{
            width: '100%',
            padding: 20,
            backgroundColor: themeColors.white,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View
            style={{
              width: frame.width - 20 * 2,
              height: frame.width - 20 * 2,
              elevation: 5,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: themeColors.grayLight,
            }}
          >
            <Image
              style={{ width: '100%', height: '100%' }}
              source={{ uri: getImageThumb(item.foodPicture, 'lg') }}
            />
          </View>
          <Text style={{ marginTop: 20, fontWeight: 'bold', fontSize: 18 }}>
            {item.foodName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              {modCurrency(
                Number(item.foodPrice) -
                  (Number(item.foodDiscount) / 100) * Number(item.foodPrice),
              )}
            </Text>
            {Number(item.foodDiscount) > 0 && (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: themeColors.textMuted,
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}
              >
                {modCurrency(Number(item.foodPrice))}
              </Text>
            )}
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              onPress={() => {
                setIsPreviewOpened(false);
                setFoodIdToPreview(null);
                handleAddToCart();
              }}
              color={themeColors.secondary}
            >
              {cartItem
                ? `${cartItem.qty} ${cartItem.qty > 1 ? 'items' : 'item'}`
                : 'Tambah'}
            </Button>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showPromptConfirmation}
        onClose={() => setShowPromptConfirmation(false)}
      >
        <View
          style={{
            width: '100%',
            padding: 20,
            backgroundColor: themeColors.white,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon
              name="circle-exclamation"
              size={80}
              color={themeColors.blue}
            />
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 20,
            }}
          >
            Mau belanja dari resto ini aja?
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              marginTop: 5,
              fontWeight: '300',
            }}
          >
            Boleh aja, tapi kita harus hapusin dulu item di keranjang kamu dari
            resto sebelumnya.
          </Text>
          <View style={{ marginTop: 20, flexDirection: 'row', gap: 15 }}>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  setShowPromptConfirmation(false);
                }}
                color={themeColors.white}
                style={{ borderWidth: 1, borderColor: themeColors.primary }}
              >
                <Text
                  style={{
                    color: themeColors.primary,
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  Batal
                </Text>
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                onPress={handleChangeMerchant}
                color={themeColors.primary}
              >
                <Text
                  style={{
                    color: themeColors.white,
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  Ya, Lanjutkan
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
