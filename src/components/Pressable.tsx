/* eslint-disable react-native/no-inline-styles */
import React, { JSX } from 'react';
import {
  StyleProp,
  TouchableHighlight,
  TouchableHighlightProps,
  Vibration,
  ViewStyle,
} from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export default function Pressable({
  onPressIn,
  onPressOut,
  onPress,
  children,
  underlayColor,
  activeOpacity,
  activeScale = 0.98,
  style,
  viewStyle,
  ...props
}: TouchableHighlightProps & {
  activeScale?: number;
  viewStyle?: StyleProp<ViewStyle>;
}): JSX.Element {
  const scale = useSharedValue(1);
  return (
    <TouchableHighlight
      {...props}
      style={[style]}
      activeOpacity={activeOpacity || 1}
      underlayColor={underlayColor || 'transparent'}
      onPressIn={e => {
        scale.value = withSpring(activeScale, {
          duration: 100,
        });
        if (onPressIn) onPressIn(e);
        Vibration.vibrate(10);
      }}
      onPress={e => {
        Vibration.vibrate([0, 5, 20, 5]);
        if (onPress) onPress(e);
      }}
      onPressOut={e => {
        scale.value = withSpring(1, {
          duration: 100,
        });
        if (onPressOut) onPressOut(e);
      }}
    >
      <Animated.View
        style={[{ transform: [{ scale }], flexGrow: 1 }, viewStyle]}
      >
        {children}
      </Animated.View>
    </TouchableHighlight>
  );
}
