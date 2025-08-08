/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import { themeColors } from '../../constants';
import modCurrency from '../../utils/modCurrency';
import modDistance from '../../utils/modDistance';

export default function ItemVertical({
  imgUri,
  title,
  price,
  distance,
  priceBeforeDisc,
  onPress,
}: {
  imgUri: string;
  title: string;
  price?: number;
  distance?: number;
  priceBeforeDisc?: number;
  onPress?: () => void;
}): JSX.Element {
  return (
    <TouchableHighlight
      activeOpacity={0.85}
      underlayColor="#fff"
      onPress={onPress}
      style={{ borderRadius: 10 }}
    >
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          width: 140,
          marginBottom: 2,
          backgroundColor: themeColors.white,
        }}
      >
        <View
          style={{
            width: '100%',
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColors.grayLighter,
          }}
        >
          <Image
            style={{
              width: '100%',
              height: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            resizeMode="cover"
            source={{ uri: imgUri }}
          />
        </View>
        <View
          style={{
            padding: 8,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            borderColor: themeColors.borderColor,
            borderTopWidth: 0,
            flex: 1,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontWeight: 'bold',
              marginBottom: 6,
              color: themeColors.grayDark,
            }}
          >
            {title}
          </Text>
          {price ? (
            <View style={{ flexDirection: 'row', marginHorizontal: -5 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  marginHorizontal: 5,
                }}
              >
                {modCurrency(price)}
              </Text>
              {priceBeforeDisc && (
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    marginHorizontal: 5,
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    color: themeColors.gray,
                  }}
                >
                  {modCurrency(priceBeforeDisc)}
                </Text>
              )}
            </View>
          ) : distance ? (
            <View style={{ flexDirection: 'row', marginHorizontal: -5 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  marginHorizontal: 5,
                }}
              >
                ~{modDistance(distance)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableHighlight>
  );
}
