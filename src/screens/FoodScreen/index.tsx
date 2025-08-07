import { JSX } from 'react';
import { ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleHeader from '../../components/SimpleHeader';
import { themeColors } from '../../constants';
import Icon from '../../components/Icon';
import ItemContainer from './ItemContainer';
import ItemVertical from './ItemVertical';
import ItemHorizontal from './ItemHorizontal';
import SliderCard from '../../components/SliderCard';

export default function FoodScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <SimpleHeader title="Food & Beverage" />
      <TouchableHighlight
        style={{ borderRadius: 10, marginBottom: 20 }}
        activeOpacity={0.85}
        underlayColor="#fff"
        onPress={() => {}}
      >
        <View
          style={{
            height: 40,
            overflow: 'hidden',
            backgroundColor: themeColors.grayLighter,
            marginHorizontal: 15,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="magnifying-glass"
              color={themeColors.textMuted}
              size={16}
            />
          </View>
          <Text
            style={{
              color: themeColors.textMuted,
              paddingHorizontal: 6,
              paddingRight: 10,
              letterSpacing: 1,
            }}
          >
            Mau makan apa hari ini?
          </Text>
        </View>
      </TouchableHighlight>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 0, paddingVertical: 20 }}
      >
        <SliderCard
          containerStyle={{ marginHorizontal: -20 }}
          items={[
            {
              imgUri: '',
              onPress: () => {},
            },
            {
              imgUri: '',
              onPress: () => {},
            },
            {
              imgUri: '',
              onPress: () => {},
            },
            {
              imgUri: '',
              onPress: () => {},
            },
            {
              imgUri: '',
              onPress: () => {},
            },
          ]}
        />
        <ItemContainer
          title="Makanan di sekitar kamu"
          horizontalScroll
          containerStyle={{ marginTop: 20, marginHorizontal: -20 }}
        >
          <View
            style={{ flexDirection: 'row', gap: 15, paddingHorizontal: 20 }}
          >
            <ItemVertical
              imgUri=""
              title="Nasi Goreng"
              price={20000}
              priceBeforeDisc={25000}
            />
            <ItemVertical imgUri="" title="Nasi Goreng 1" distance={100} />
            <ItemVertical
              imgUri=""
              title="Nasi Goreng"
              price={20000}
              priceBeforeDisc={25000}
            />
            <ItemVertical imgUri="" title="Nasi Goreng 1" distance={100} />
          </View>
        </ItemContainer>
        <ItemContainer
          title="Resto"
          containerStyle={{ marginHorizontal: -20, marginTop: 20 }}
        >
          <View style={{ gap: 10 }}>
            <ItemHorizontal
              imgUri=""
              title="Nasi Goreng 1"
              subTitle="Warung Nasi Goreng"
              price={20000}
              priceBeforeDisc={25000}
            />
            <ItemHorizontal
              imgUri=""
              title="Nasi Goreng 2"
              subTitle="Warung Nasi Goreng"
              price={20000}
              priceBeforeDisc={25000}
            />
            <ItemHorizontal
              imgUri=""
              title="Nasi Goreng 3"
              subTitle="Warung Nasi Goreng"
              price={20000}
              priceBeforeDisc={25000}
            />
          </View>
        </ItemContainer>
      </ScrollView>
    </View>
  );
}
