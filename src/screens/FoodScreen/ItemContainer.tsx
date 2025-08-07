import { JSX, ReactNode } from 'react';
import { ScrollView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { themeColors } from '../../constants';

export default function ItemContainer({
  title,
  subTitle,
  onSeeMore,
  horizontalScroll,
  children,
  containerStyle
}: {
  title: string;
  subTitle?: string;
  onSeeMore?: () => void;
  horizontalScroll?: boolean;
  children: JSX.Element;
  containerStyle?: StyleProp<ViewStyle>
}): JSX.Element {
  return (
    <View style={containerStyle}>
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 10
          }}
        >
          <View>
            <Text
              numberOfLines={1}
              style={{ fontWeight: 'bold', marginBottom: subTitle ? 3 : 0 }}
            >
              {title}
            </Text>
            {subTitle && <Text numberOfLines={1}>{subTitle}</Text>}
          </View>
          {onSeeMore && (
            <View>
              <TouchableOpacity onPress={onSeeMore} activeOpacity={1}>
                <Text style={{ color: themeColors.secondary }}>
                  Lihat semua
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {horizontalScroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
}
