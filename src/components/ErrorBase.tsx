/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { Text, View } from 'react-native';
import Icon from './Icon';
import { themeColors } from '../constants';
import Pressable from './Pressable';

export default function ErrorBase({
  error,
  onReload,
  mode,
}: {
  error: Error | TypeError;
  onReload?: () => void;
  mode?: 'horizontal' | 'vertical';
}): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexDirection: mode === 'horizontal' ? 'row' : undefined,
      }}
    >
      <Icon name="triangle-exclamation" color={themeColors.red} size={mode === 'horizontal' ? 20 : 50} />
      <View style={{ gap: 4 }}>

        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
          {error?.message || 'Terjadi kesalahan'}
        </Text>
        {onReload && (
          <Pressable viewStyle={{ flexGrow: 0 }} onPress={onReload} >
            <Text style={{ color: themeColors.red, fontWeight: 'bold', textAlign: mode === 'horizontal' ? 'left' : 'center' }}>Coba Lagi</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
