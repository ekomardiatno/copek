/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { Text, View } from 'react-native';
import { themeColors } from '../../constants';
import { colorYiq } from '../../utils';
import Icon from '../Icon';
import { FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import Pressable from '../Pressable';

export default function Menu({
  onPress,
  color,
  iconName,
  title,
  size,
  disabled
}: {
  onPress: () => void;
  color: string;
  iconName: FontAwesome6SolidIconName;
  title: string;
  size?: number;
  disabled?: boolean;
}): JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={{ padding: 15 }}
      disabled={disabled}
    >
      <View style={{ alignItems: 'center', opacity: disabled ? .5 : 1 }}>
        <View
          style={{
            width: size ? size < 60 ? 60 : size : 60,
            height: size ? size < 60 ? 60 : size : 60,
            borderRadius: (size ? size < 60 ? 60 : size : 60) / 2,
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            borderColor: themeColors.grayLight,
            borderWidth: 4,
          }}
        >
          <Icon size={size ? size / 4 < 40 ? 40 : size / 4 : 40} color={colorYiq(color)} name={iconName} />
        </View>
        <Text
          style={{
            letterSpacing: 0.75,
            color: themeColors.textMuted,
            textTransform: 'uppercase',
            fontSize: size ? size / 9 < 14 ? 14 : size / 9 : 14,
          }}
          numberOfLines={1}
        >
          <Text style={{ color: themeColors.grayDark, fontWeight: 'bold' }}>
            {title}
          </Text>
        </Text>
      </View>
    </Pressable>
  );
}
