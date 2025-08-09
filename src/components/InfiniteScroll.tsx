/* eslint-disable react-native/no-inline-styles */
import { JSX, useRef } from 'react';
import { View } from 'react-native';
import Spinner from './Spinner';
import Animated from 'react-native-reanimated';

export default function InfiniteScroll({
  children,
  loading,
  onLoading,
  hasReachedBottom
}: {
  children: React.ReactNode | JSX.Element;
  loading: boolean;
  onLoading: () => void;
  hasReachedBottom: boolean;
}): JSX.Element {
  const scrollRef = useRef<Animated.ScrollView | null>(null);
  return (
    <Animated.ScrollView
      ref={scrollRef}
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
      {loading && (
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
