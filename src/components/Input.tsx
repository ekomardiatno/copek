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
  ...props
}: TextInputProps & {
  style?: StyleProp<ViewStyle>;
  iconName?: FontAwesome6SolidIconName;
  styleTextInput?: StyleProp<TextStyle>;
}): JSX.Element {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: themeColors.grayLighter,
          borderRadius: 10,
          paddingHorizontal: 15,
        },
        style,
      ]}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: iconName ? 15 : 0,
        }}
      >
        {iconName && <Icon name={iconName} size={16} />}
      </View>
      <TextInput
        {...props}
        placeholderTextColor={themeColors.gray}
        style={[
          {
            color: themeColors.black,
            fontFamily: 'Yantramanav',
            flex: 1,
            height: 40,
            padding: 0,
            letterSpacing: 1,
          },
          styleTextInput,
        ]}
      />
    </View>
  );
}
