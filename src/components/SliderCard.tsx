/* eslint-disable react-native/no-inline-styles */
import { JSX, useEffect, useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp, View,
  ViewStyle
} from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { themeColors } from '../constants';
import Pressable from './Pressable';

export default function SliderCard({
  containerStyle,
  items = [],
}: {
  containerStyle?: StyleProp<ViewStyle>;
  items: {
    imgUri: string;
    onPress: () => void;
  }[];
}): JSX.Element {
  const frame = useSafeAreaFrame();
  const width = frame.width - 100;
  const height = (width / 16) * 9;
  const scrollRef = useRef<ScrollView | null>(null);
  let autoScroll = useRef<NodeJS.Timeout | null>(null);
  const [play, setPlay] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (items.length > 0 && play) {
      autoScroll.current = setInterval(() => {
        setSelectedIndex(prev => {
          const next = prev === items.length - 1 ? 0 : prev + 1;
          if (scrollRef.current) {
            scrollRef.current.scrollTo({
              animated: true,
              y: 0,
              x: (width + 10) * next,
            });
          }
          return next;
        });
      }, 3000);
      return () => {
        if (autoScroll.current) clearInterval(autoScroll.current);
      };
    }
  }, [items, play, width]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    let targetIndex = Math.floor(offsetX / width);

    if (offsetX >= width / 2 + 15 + (width + 10) * targetIndex) {
      targetIndex = targetIndex + 1;
    }

    setSelectedIndex(targetIndex);
    scrollRef.current?.scrollTo({
      animated: true,
      y: 0,
      x: (width + 10) * targetIndex,
    });
    setPlay(true);
  };

  return (
    <View style={containerStyle}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          setPlay(false);
          if (autoScroll.current) clearInterval(autoScroll.current);
        }}
        onScrollEndDrag={handleScroll}
      >
        {items.map((item, index) => {
          let margin = {};

          if (index === 0) {
            margin = {
              marginLeft: 15,
            };
          } else if (index === items.length - 1) {
            margin = {
              marginRight: 15,
            };
          }
          return (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={{ borderRadius: 8, width, height, marginHorizontal: 5, ...margin }}
            >
              <View
                style={{
                  width: width,
                  height: height,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  backgroundColor: themeColors.grayLighter,
                }}
              >
                <Image
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  resizeMode="cover"
                  source={{ uri: item.imgUri }}
                />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <View
        style={{
          marginHorizontal: 15,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
          }}
        >
          {items.map((_item, i) => (
            <View
              key={(i + 1) * Math.random()}
              style={{
                width: 12,
                height: 12,
                borderRadius: 20,
                marginLeft: i === 0 ? 0 : 5,
                borderWidth: 2,
                borderColor:
                  selectedIndex === i
                    ? themeColors.primary
                    : themeColors.grayLighter,
                marginHorizontal: 5,
                backgroundColor:
                  selectedIndex === i
                    ? themeColors.primary
                    : themeColors.grayLight,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
