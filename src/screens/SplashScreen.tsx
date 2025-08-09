/* eslint-disable react-native/no-inline-styles */
import { JSX, useEffect } from 'react';
import { View } from 'react-native';
import useCustomNavigation from '../hooks/useCustomNavigation';
import useAppSelector from '../hooks/useAppSelector';
import { SessionStateType } from '../redux/reducers/app.reducer';

export default function SplashScreen(): JSX.Element {
  const navigation = useCustomNavigation();
  const session = useAppSelector<SessionStateType | null>(
    state => state.appReducer.session,
  );

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
