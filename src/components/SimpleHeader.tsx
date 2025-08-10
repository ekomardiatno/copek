/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { StatusBar, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themeColors } from '../constants';
import Icon from './Icon';
import useAppNavigation from '../hooks/useAppNavigation';
import Pressable from './Pressable';

export default function SimpleHeader({
  title,
  disableBack = false,
  containerStyle
}: {
  title?: string;
  disableBack?: boolean;
  containerStyle?: StyleProp<ViewStyle>
}): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View
        style={[{
          flexDirection: 'row',
          paddingHorizontal: !title ? 0 : 15,
          paddingVertical: !title ? 0 : 10,
          marginHorizontal: -5,
          paddingTop: insets.top + (!title ? 0 : 10),
          backgroundColor: themeColors.white,
          alignItems: 'center',
        }, containerStyle]}
      >
        {title && navigation.canGoBack() && (
          <View>
            <Pressable
              onPress={() => navigation.goBack()}
              disabled={disableBack}
            >
              <View
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
              </View>
            </Pressable>
          </View>
        )}
        {title && (
          <View
            style={{
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
