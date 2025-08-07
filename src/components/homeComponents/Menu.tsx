import { JSX } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { themeColors } from '../../constants';
import { colorYiq } from '../../utils';
import Icon from '../Icon';
import { FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';

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
  const { width } = useSafeAreaFrame();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
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
            borderColor: themeColors.grayLighter,
            borderWidth: 4,
          }}
        >
          <Icon size={size ? size / 4 < 30 ? 30 : size / 4 : 30} color={colorYiq(color)} name={iconName} />
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
    </TouchableOpacity>
  );
}
