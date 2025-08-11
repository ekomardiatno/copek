/* eslint-disable react-native/no-inline-styles */
import { JSX, useRef, useState } from 'react';
import { View } from 'react-native';
import Spinner from './Spinner';
import Animated, { AnimatedScrollViewProps } from 'react-native-reanimated';

export default function InfiniteScroll({
  children,
  onLoading,
  hasReachedBottom,
  ...props
}: AnimatedScrollViewProps & {
  children: React.ReactNode | JSX.Element;
  onLoading: () => void;
  hasReachedBottom: boolean;
}): JSX.Element {
  const scrollRef = useRef<Animated.ScrollView | null>(null);
  const [loaded, setLoaded] = useState(false);
  return (
    <Animated.ScrollView
      {...props}
      ref={scrollRef}
      onScroll={e => {
        if (e.nativeEvent.contentOffset.y >= 10) {
          setLoaded(true);
        }
      }}
      onMomentumScrollEnd={e => {
        if (
          Math.floor(e.nativeEvent.contentOffset.y) >=
          Math.floor(
            e.nativeEvent.contentSize.height -
              e.nativeEvent.layoutMeasurement.height,
          ) -
            70
        ) {
          if (!hasReachedBottom) {
            onLoading();
            scrollRef.current?.scrollTo({
              y: e.nativeEvent.contentOffset.y + 70,
              x: 0,
              animated: true,
            });
          }
        }
      }}
    >
      {children}
      {loaded && !hasReachedBottom && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 70,
          }}
        >
          <Spinner />
        </View>
      )}
    </Animated.ScrollView>
  );
}
