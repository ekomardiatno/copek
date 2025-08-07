import { useNavigation } from '@react-navigation/native';
import { JSX, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export default function SplashScreen(): JSX.Element {
  const navigation = useNavigation();
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
  }, [session]);

  return <View style={{ flex: 1 }}></View>;
}
