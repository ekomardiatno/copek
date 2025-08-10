/* eslint-disable react-native/no-inline-styles */
import { JSX, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleHeader from '../components/SimpleHeader';
import { ScrollView, Text, View } from 'react-native';
import { themeColors } from '../constants';
import { CurrentGeocodeLocationContext } from '../components/CurrentGeocodeLocationProvider';
import Input from '../components/Input';
import useAppSelector from '../hooks/useAppSelector';
import FoodItem, { FoodItemProvider } from '../components/FoodItem';
import Dash from 'react-native-dash-2';
import modCurrency from '../utils/modCurrency';
import modDistance from '../utils/modDistance';
import Button from '../components/Button';
import useAppNavigation from '../hooks/useAppNavigation';
import Pressable from '../components/Pressable';

export default function FoodOrderSecreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const { routeName } = useContext(CurrentGeocodeLocationContext);
  const cart = useAppSelector(state => state.cartReducer.cart);
  const navigation = useAppNavigation();
  return (
    <FoodItemProvider>
      <View
        style={{
          flex: 1,
          paddingBottom: insets.bottom,
          backgroundColor: themeColors.grayLighter,
        }}
      >
        <SimpleHeader
          title="Konfirmasi Order"
          containerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: themeColors.borderColor,
          }}
        />
        <ScrollView>
          <View style={{ padding: 20, paddingVertical: 10 }}>
            <View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: themeColors.borderColor,
                  backgroundColor: themeColors.white,
                  padding: 15,
                  borderRadius: 15,
                }}
              >
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  <Text style={{ fontWeight: '500', fontSize: 14 }}>
                    Lokasi pengiriman
                  </Text>
                  <View style={{ position: 'absolute', top: 0, right: 0 }}>
                    <Pressable
                      viewStyle={{
                        flexGrow: 0,
                        backgroundColor: themeColors.white,
                        borderColor: themeColors.primary,
                        borderWidth: 1,
                        borderRadius: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 3,
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '600',
                          color: themeColors.primary,
                          fontSize: 13
                        }}
                      >
                        Ganti lokasi
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 15,
                  }}
                >
                  <View style={{ flex: 1, gap: 5 }}>
                    <Text style={{ fontSize: 14, fontWeight: '400' }}>
                      {routeName}
                    </Text>
                  </View>
                </View>
                <View>
                  <Input
                    multiline
                    maxLength={200}
                    iconName="note-sticky"
                    placeholder="Tambahkan catatan"
                    styleTextInput={{ fontSize: 13, paddingVertical: 12 }}
                    iconSize={13}
                    iconStyle={{ paddingVertical: 12 }}
                  />
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: themeColors.borderColor,
                  backgroundColor: themeColors.white,
                  padding: 15,
                  marginTop: 20,
                  borderRadius: 15,
                }}
              >
                {cart.length > 0 && (
                  <>
                    <View
                      style={{
                        gap: 1,
                        backgroundColor: themeColors.borderColor,
                      }}
                    >
                      {cart.map(item => (
                        <FoodItem key={item.foodId} item={item} />
                      ))}
                    </View>
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderTopColor: themeColors.borderColor,
                        paddingTop: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>
                          Butuh yang lain?
                        </Text>
                        <Text
                          style={{
                            marginTop: 5,
                            fontWeight: '300',
                            fontSize: 13,
                          }}
                        >
                          Tambah menu lain juga kalau mau.
                        </Text>
                      </View>
                      <Button
                        onPress={() => {
                          navigation.goBack();
                        }}
                        color={themeColors.white}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderWidth: 1,
                          borderColor: themeColors.primary,
                        }}
                      >
                        <Text
                          style={{
                            color: themeColors.primary,
                            fontSize: 12,
                            fontWeight: '700',
                          }}
                        >
                          Add More
                        </Text>
                      </Button>
                    </View>
                  </>
                )}
                {cart.length <= 0 ? (
                  <View style={{ marginTop: 15 }}>
                    <Text
                      style={{
                        color: themeColors.textMuted,
                        textAlign: 'center',
                      }}
                    >
                      Belum ada pesanan.
                    </Text>
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: themeColors.borderColor,
                  backgroundColor: themeColors.white,
                  padding: 15,
                  marginTop: 20,
                  borderRadius: 15,
                }}
              >
                <View>
                  <Text style={{ fontWeight: '500', fontSize: 14 }}>
                    Ringkasan pembayaran
                  </Text>
                </View>
                <View>
                  <View style={{ paddingVertical: 15, paddingBottom: 9 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                      <Text style={{ flex: 1 }}>Total Harga</Text>
                      <Text style={{ flex: 1, textAlign: 'right' }}>
                        {modCurrency(
                          cart.reduce((a, b) => {
                            return a + b.qty * Number(b.foodPrice);
                          }, 0),
                        )}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                      <Text style={{ flex: 1 }}>Potongan</Text>
                      <Text style={{ flex: 1, textAlign: 'right' }}>
                        {cart.reduce((a, b) => {
                          return (
                            a +
                            ((b.qty * Number(b.foodDiscount)) / 100) *
                              Number(b.foodPrice)
                          );
                        }, 0) > 0
                          ? '-' +
                            modCurrency(
                              cart.reduce((a, b) => {
                                return (
                                  a +
                                  ((b.qty * Number(b.foodDiscount)) / 100) *
                                    Number(b.foodPrice)
                                );
                              }, 0),
                            )
                          : modCurrency(
                              cart.reduce((a, b) => {
                                return (
                                  a +
                                  ((b.qty * Number(b.foodDiscount)) / 100) *
                                    Number(b.foodPrice)
                                );
                              }, 0),
                            )}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                      <Text style={{ flex: 1 }}>
                        Ongkos Kirim ({modDistance(1000)})
                      </Text>
                      <Text style={{ flex: 1, textAlign: 'right' }}>
                        {modCurrency(5000)}
                      </Text>
                    </View>
                  </View>
                  <Dash
                    dashThickness={1}
                    dashLength={2}
                    dashGap={2}
                    dashColor={themeColors.borderColor}
                    style={{
                      width: '100%',
                      height: 1,
                      transform: [{ translateY: -1.5 }],
                    }}
                  />
                  <View style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ flex: 1, fontWeight: 'bold' }}>
                        Total pembayaran
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                      >
                        {modCurrency(
                          cart.reduce((a, b) => {
                            return (
                              a +
                              b.qty *
                                (Number(b.foodPrice) -
                                  (Number(b.foodDiscount) / 100) *
                                    Number(b.foodPrice))
                            );
                          }, 0) + 5000,
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            padding: 20,
            backgroundColor: themeColors.white,
            borderTopWidth: 1,
            borderTopColor: themeColors.borderColor,
          }}
        >
          <Button>Pesan sekarang</Button>
        </View>
      </View>
    </FoodItemProvider>
  );
}
