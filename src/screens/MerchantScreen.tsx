/* eslint-disable react-native/no-inline-styles */
import { JSX } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SimpleHeader from "../components/SimpleHeader";

export default function MerchantScreen(): JSX.Element {
  return (
    <View style={{ flex: 1, paddingBottom: useSafeAreaInsets().bottom }}>
      <SimpleHeader title="Detail Pedagang" />
    </View>
  )
}