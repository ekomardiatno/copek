/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { Text, View } from 'react-native';
import Icon from './Icon';
import { themeColors } from '../constants';
import Button from './Button';

export default function ErrorBase({
  error,
  onReload,
}: {
  error: Error | TypeError;
  onReload?: () => void;
}): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <Icon name="triangle-exclamation" color={themeColors.red} size={50} />
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
        {error?.message || 'Terjadi kesalahan'}
      </Text>
      {onReload && (
        <Button onPress={onReload} color={themeColors.red}>Coba Lagi</Button>
      )}
    </View>
  );
}
