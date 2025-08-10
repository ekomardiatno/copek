/* eslint-disable react-native/no-inline-styles */
import { JSX, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCart } from '../../redux/actions/cart.action';
import useAppSelector from '../../hooks/useAppSelector';
import { CartType } from '../../redux/reducers/cart.reducer';
import Modal from '../Modal';
import { CartContext } from '.';
import { Text, View } from 'react-native';
import { themeColors } from '../../constants';
import modCurrency from '../../utils/modCurrency';
import Icon from '../Icon';
import Input from '../Input';
import Pressable from '../Pressable';

export default function CartItemModal(): JSX.Element {
  const dispatch = useDispatch();
  const cart = useAppSelector<CartType[]>(state => state.cartReducer.cart);
  const { isOpenCartItemModal, setIsOpenCartItemModal, selectedCartItem } =
    useContext(CartContext);
  const [qtyInputValue, setQtyInputValue] = useState<string>('');
  const [noteInputValue, setNoteInputValue] = useState<string>('');

  useEffect(() => {
    if (selectedCartItem) {
      setQtyInputValue(selectedCartItem.qty.toString());
    }
  }, [selectedCartItem]);

  function handleChangeQty(type: 'add' | 'subtract') {
    if (!selectedCartItem) return;
    const findItem = cart.find(r => r.foodId === selectedCartItem.foodId);
    if (findItem) {
      let newQty = findItem.qty;
      if (type === 'add') {
        newQty = newQty + 1;
      } else {
        newQty = newQty - 1;
      }
      if (newQty > 20) return;
      handleUpdateQtyState(newQty);
    }
  }

  const handleUpdateQtyState = (newQty: number) => {
    if (!selectedCartItem) return;
    const filterCart = cart.filter(r => r.foodId !== selectedCartItem.foodId);
    const findItem = cart.find(r => r.foodId === selectedCartItem.foodId);
    if (!findItem) return;
    if (newQty <= 0) {
      dispatch(setCart(filterCart));
      setIsOpenCartItemModal(false);
    } else {
      dispatch(
        setCart([
          ...filterCart,
          {
            ...findItem,
            qty: newQty,
          },
        ]),
      );
    }
    setQtyInputValue(newQty.toString());
  };

  const handleChangeTextQty = (text: string) => {
    const input = text.replace(/\D+/g, '');
    if (Number(input) > 20) return;
    setQtyInputValue(input);
    if (input === '') return;
    if (!selectedCartItem) return;
    const findItem = cart.find(r => r.foodId === selectedCartItem.foodId);
    if (!findItem) return;
    const newQty = Number(input);
    handleUpdateQtyState(newQty);
  };

  const handleChangeNoteTextValue = (text: string) => {
    setNoteInputValue(text);
    if (!selectedCartItem) return;
    const findItem = cart.find(r => r.foodId === selectedCartItem.foodId);
    if (!findItem) return;
    const filterCart = cart.filter(r => r.foodId !== selectedCartItem.foodId);
    dispatch(
      setCart([
        ...filterCart,
        {
          ...findItem,
          note: text,
        },
      ]),
    );
  };

  return (
    <Modal
      visible={isOpenCartItemModal}
      onClose={() => setIsOpenCartItemModal(false)}
    >
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: themeColors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {selectedCartItem && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}
            >
              {selectedCartItem.foodName}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 15,
              }}
            >
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
                    Number(selectedCartItem.foodPrice) -
                      (Number(selectedCartItem.foodDiscount) / 100) *
                        Number(selectedCartItem.foodPrice),
                  )}
                </Text>
                {Number(selectedCartItem.foodDiscount) > 0 && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: themeColors.textMuted,
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    }}
                  >
                    {modCurrency(Number(selectedCartItem.foodPrice))}
                  </Text>
                )}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={() => {
                    handleChangeQty('subtract');
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 28 / 2,
                      borderWidth: 1,
                      borderColor: themeColors.borderColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      name="minus"
                      color={themeColors.textColor}
                      size={16}
                    />
                  </View>
                </Pressable>
                <Input
                  keyboardType="number-pad"
                  style={{
                    width: 40,
                    height: 40,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    alignItems: 'center',
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                  }}
                  value={qtyInputValue}
                  onChangeText={handleChangeTextQty}
                  maxLength={2}
                  styleTextInput={{
                    height: 30,
                    textAlign: 'center',
                    paddingVertical: 0,
                  }}
                />

                <Pressable
                  onPress={() => {
                    handleChangeQty('add');
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 28 / 2,
                      borderWidth: 1,
                      borderColor: themeColors.borderColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="plus" color={themeColors.textColor} size={16} />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        <Input
          multiline
          iconName="note-sticky"
          placeholder="Tambahkan catatan"
          value={noteInputValue}
          onChangeText={handleChangeNoteTextValue}
        />
        <View style={{ marginTop: 20 }} />
      </View>
    </Modal>
  );
}
