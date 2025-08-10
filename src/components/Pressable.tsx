import { JSX } from 'react';
import { TouchableHighlight, TouchableHighlightProps } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export default function Pressable({
  onPressIn,
  onPressOut,
  children,
  underlayColor,
  activeOpacity,
  activeScale = 0.98,
  ...props
}: TouchableHighlightProps & {
  activeScale?: number;
}): JSX.Element {
  const scale = useSharedValue(1);
  return (
    <TouchableHighlight
      {...props}
      activeOpacity={activeOpacity || 1}
      underlayColor={underlayColor || 'transparent'}
      onPressIn={e => {
        scale.value = withSpring(activeScale, {
          duration: 100,
        });
        if (onPressIn) onPressIn(e);
      }}
      onPressOut={e => {
        scale.value = withSpring(1, {
          duration: 100,
        });
        if (onPressOut) onPressOut(e);
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </TouchableHighlight>
  );
}
