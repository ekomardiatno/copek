/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  Text,
} from 'react-native';
import { themeColors } from '../constants';

// Spinner.tsx
// Simple, customizable spinner component for React Native (TypeScript)
// No extra dependencies required.

type SpinnerProps = {
  /** Diameter of the spinner in pixels */
  size?: number;
  /** Color for the inner ActivityIndicator and ring */
  color?: string;
  /** Border thickness of the ring */
  thickness?: number;
  /** Rotation speed (duration in ms for one full rotation) */
  speed?: number;
  /** Whether to show the built-in ActivityIndicator at the center */
  showIndicator?: boolean;
  /** Optional text label under the spinner */
  label?: string;
  /** Style for the outer container */
  style?: StyleProp<ViewStyle>;
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 48,
  color = themeColors.primary,
  thickness = 3,
  speed = 800,
  showIndicator = false,
  label,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [rotateAnim, speed]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Outer ring: we draw a circle using border with a gap by making two semicircular halves
  // This approach uses two overlapping halves to simulate a ring with a colored arc.
  const halfSize = size / 2;
  const arcStyle = {
    width: size,
    height: size,
    borderRadius: halfSize,
    borderWidth: thickness,
    borderColor: 'transparent',
    position: 'absolute' as const,
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: spin }],
        }}
      >
        {/* Left half (colored) */}
        <View
          style={[
            arcStyle,
            {
              borderLeftColor: color,
              borderTopColor: color,
              borderBottomColor: 'transparent',
              borderRightColor: 'transparent',
            },
          ]}
        />

        {/* Right half (transparent) */}
        <View
          style={[
            arcStyle,
            {
              borderRightColor: color,
              borderTopColor: 'transparent',
              borderBottomColor: color,
              borderLeftColor: 'transparent',
              transform: [{ rotate: '90deg' }],
            },
          ]}
        />

        {/* Inner indicator to smooth the center */}
        {showIndicator && (
          <View
            style={{
              position: 'absolute',
              width: size * 0.5,
              height: size * 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator
              size={Math.max(16, Math.round(size * 0.25)) as any}
              color={color}
            />
          </View>
        )}
      </Animated.View>

      {label ? (
        <Text style={[styles.label, { marginTop: 8 }]}>{label}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
});

// Example usage (App.tsx)
// import React from 'react';
// import {SafeAreaView, View} from 'react-native';
// import {Spinner} from './Spinner';
//
// export default function App() {
//   return (
//     <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <View>
//         <Spinner size={64} color="#ff4500" thickness={4} speed={900} label="Loading..." />
//       </View>
//     </SafeAreaView>
//   );
// }

export default Spinner;
