import * as React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
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
