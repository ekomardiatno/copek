/* eslint-disable react-native/no-inline-styles */
import { JSX } from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import { themeColors } from "../../constants";
import modCurrency from "../../utils/modCurrency";
import modDistance from "../../utils/modDistance";

export default function ItemHorizontal({
  imgUri,
  title,
  subTitle,
  price,
  distance,
  priceBeforeDisc,
  onPress,
}: {
  imgUri: string;
  title: string;
  subTitle: string;
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
    >
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColors.grayLighter,
          }}
        >
          <Image
            style={{ width: '100%', height: '100%', borderRadius: 5 }}
            resizeMode="cover"
            source={{
              uri: imgUri,
            }}
          />
        </View>
        {price && priceBeforeDisc && (
          <View
            style={{
              position: 'absolute',
              top: 5,
              left: 10.5,
              width: 55,
              height: 24,
            }}
          >
            <Image
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
              source={require('../../assets/images/ribbon.png')}
            />
          </View>
        )}
        <View style={{ paddingLeft: 10, flex: 1 }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: themeColors.grayDark,
              fontSize: 15,
              marginBottom: 2,
            }}
          >
            {title}
          </Text>
          {subTitle && (
            <Text
              numberOfLines={1}
              style={{
                marginBottom: 8,
                fontSize: 13,
                color: themeColors.grayDark,
              }}
            >
              {subTitle}
            </Text>
          )}
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
                {modDistance(distance)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableHighlight>
  );
}