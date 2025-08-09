/* eslint-disable react-native/no-inline-styles */
import { JSX, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import useCustomNavigation from '../hooks/useCustomNavigation';

export default function SplashScreen(): JSX.Element {
  const navigation = useCustomNavigation();
  const session = useSelector<any>(state => state?.appReducer?.session || null);

  useEffect(() => {
    if (session) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Home' as never,
          },
        ],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login' as never,
          },
        ],
      });
    }
  }, [navigation, session]);

  return <View style={{ flex: 1 }} />;
}
