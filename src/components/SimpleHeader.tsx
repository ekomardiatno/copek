/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { StatusBar, Text, TouchableHighlight, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themeColors } from '../constants';
import Icon from './Icon';
import useCustomNavigation from '../hooks/useCustomNavigation';

export default function SimpleHeader({
  title,
  disableBack = false,
}: {
  title?: string;
  disableBack?: boolean;
}): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useCustomNavigation();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: !title ? 0 : 15,
          paddingVertical: !title ? 0 : 10,
          marginHorizontal: -5,
          paddingTop: insets.top + (!title ? 0 : 10),
          backgroundColor: themeColors.white,
        }}
      >
        {title && navigation.canGoBack() && (
          <View>
            <TouchableHighlight
              onPress={() => navigation.goBack()}
              disabled={disableBack}
              underlayColor="#fff"
              activeOpacity={0.85}
              style={{
                height: 40,
                marginHorizontal: 5,
                width: 40,
                borderRadius: 40 / 2,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={18} name={'chevron-left'} />
            </TouchableHighlight>
          </View>
        )}
        {title && (
          <View
            style={{
              flex: 1,
              marginHorizontal: 5,
              justifyContent: 'center',
              height: 40,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: themeColors.grayDark,
              }}
            >
              {title}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
