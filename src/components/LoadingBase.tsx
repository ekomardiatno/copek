/* eslint-disable react-native/no-inline-styles */
import { JSX } from 'react';
import { View } from 'react-native';
import Spinner from './Spinner';

export default function LoadingBase(): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
      }}
    >
      <Spinner />
    </View>
  );
}
