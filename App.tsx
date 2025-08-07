import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { themeColors } from './src/constants';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Text, View } from 'react-native';
import Navigation from './src/Navigation';
import CurrentGeocodeLocationProvider from './src/components/CurrentGeocodeLocationProvider';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CurrentGeocodeLocationProvider>
          <Navigation />
        </CurrentGeocodeLocationProvider>
      </PersistGate>
    </Provider>
  );
}
