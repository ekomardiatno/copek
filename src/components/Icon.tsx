import { FontAwesome6, FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import { themeColors } from '../constants';
import { JSX } from 'react';

export default function Icon({
  name,
  size = 24,
  color = themeColors.black,
  style,
}: {
  name: FontAwesome6SolidIconName;
  size?: number;
  color?: string;
  style?: object;
}): JSX.Element {
  if (!name) return <></>;
  return (
    <FontAwesome6
      iconStyle="solid"
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}
