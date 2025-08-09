import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { JSX } from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { themeColors } from "./constants";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import SplashScreen from "./screens/SplashScreen";
import FoodScreen from "./screens/FoodScreen";
import SearchMenuScreen from "./screens/SearchMenuScreen";
import ListMenuScreen from "./screens/ListMenuScreen";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Splash: undefined; // with params
  Login: undefined; // no params
  Register: undefined; // no params
  Home: undefined; // no params
  Food: undefined; // no params
  SearchMenu: undefined; // no params
  'List Menu': {
    params?: { moreCategory: 'rand' | 'nearest' };
  };
};

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'ios_from_right',
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Food"
        component={FoodScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SearchMenu"
        component={SearchMenuScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="List Menu"
        component={ListMenuScreen}
      />
    </Stack.Navigator>
  );
}

export default function Navigation(): JSX.Element {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: themeColors.primary,
          background: themeColors.white,
          card: themeColors.white,
          text: themeColors.black,
          border: themeColors.borderColor,
          notification: themeColors.red,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: 'normal' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: 'bold' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <RootStack />
    </NavigationContainer>
  );
}

// Add type helper for `useNavigation`
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}