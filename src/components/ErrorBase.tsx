/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Icon from './Icon';
import { themeColors } from '../constants';

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
      <Icon name="triangle-exclamation" color={themeColors.red} size={40} />
      <Text style={{ fontWeight: 'bold' }}>
        {error?.message || 'Terjadi kesalahan'}
      </Text>
      {onReload && (
        <TouchableHighlight onPress={onReload}>
          <View
            style={{
              padding: 10,
              paddingHorizontal: 20,
              backgroundColor: themeColors.red,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: themeColors.white, textAlign: 'center' }}>
              Coba lagi
            </Text>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
}
