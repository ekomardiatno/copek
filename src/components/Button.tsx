/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import {
  ColorValue,
  Text,
  TouchableHighlightProps, View
} from 'react-native';
import { themeColors } from '../constants';
import Pressable from './Pressable';

export default function Button({
  children,
  color = themeColors.primary,
  style,
  ...props
}: TouchableHighlightProps & {
    children: JSX.Element | string;
    color?: ColorValue;
  }): JSX.Element {
  return (
    <Pressable {...props}>
      <View
        style={[
          {
            backgroundColor: color,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 100,
            alignItems: 'center',
            opacity: props.disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {typeof children === 'string' ? (
          <Text
            style={{
              color: themeColors.white,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}
