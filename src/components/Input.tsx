/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { themeColors } from '../constants';
import Icon from './Icon';
import { FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';

export default function Input({
  style,
  iconName,
  styleTextInput,
  iconStyle,
  iconSize,
  iconColor,
  ...props
}: TextInputProps & {
  style?: StyleProp<ViewStyle>;
  iconName?: FontAwesome6SolidIconName;
  styleTextInput?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string
}): JSX.Element {
  return (
    <View>
      <View
        style={[
          {
            flexDirection: 'row',
            backgroundColor: themeColors.grayLighter,
            borderRadius: 20,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: themeColors.borderColor,
            alignItems: 'flex-end'
          },
          style,
        ]}
      >
        {iconName && (
          <View
            style={[{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 15,
              paddingVertical: 14
            }, iconStyle]}
          >
            <Icon name={iconName} color={iconColor || themeColors.grayDark} size={iconSize || 16} />
          </View>
        )}
        <TextInput
          {...props}
          placeholderTextColor={themeColors.textHint}
          style={[
            {
              color: themeColors.black,
              fontFamily: 'Yantramanav',
              flex: 1,
              padding: 0,
              paddingVertical: 12,
              fontSize: 15,
            },
            styleTextInput,
          ]}
        />
      </View>
    </View>
  );
}
