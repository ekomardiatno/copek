/* eslint-disable react-native/no-inline-styles */
import {
  ScrollView,
  Text, View,
  TextInput,
  Image
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { themeColors } from '../constants';
import { colorYiq } from '../utils';
import SimpleHeader from '../components/SimpleHeader';
import { useDispatch } from 'react-redux';
import { setSession } from '../redux/actions/app.action';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon';
import { login } from '../services/auth-services';
import customUseNavigation from '../hooks/useAppNavigation';
import Pressable from '../components/Pressable';
import { phoneRegex } from '../utils/regex';

export default function LoginScreen() {
  const navigation = customUseNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<Error | TypeError | null>(null);
  const [isSecurePass, setIsSecurePass] = useState(true);
  const [inputErrors, setInputErrors] = useState({
    phone: '',
    password: '',
  });
  const frame = useSafeAreaFrame();

  const handleLogin = () => {
    setInputErrors({
      phone: '',
      password: '',
    });
    if (!phone || !password) {
      setInputErrors({
        phone: !phone ? 'No. Handphone tidak boleh kosong.' : '',
        password: !password ? 'Kata sandi tidak boleh kosong.' : '',
      });
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      setInputErrors(prev => ({
        ...prev,
        phone: 'No. Handphone harus antara 10 hingga 15 digit.',
      }));
      return;
    }
    if (password.length < 6) {
      setInputErrors(prev => ({
        ...prev,
        password: 'Kata sandi minimal 6 karakter.',
      }));
      return;
    }
    if (!/^\d+$/.test(phone)) {
      setInputErrors(prev => ({
        ...prev,
        phone: 'No. Handphone hanya boleh berisi angka.',
      }));
      return;
    }
    if (!phoneRegex.test(phone)) {
      setInputErrors(prev => ({
        ...prev,
        phone: 'No. Handphone tidak sesuai',
      }));
      return;
    }
    setIsLoggingIn(true);
  };

  const fetchLogin = useCallback(
    async (signal?: AbortSignal) => {
      if (!isLoggingIn) return;
      setError(null);
      try {
        const payload = {
          userPhone: phone,
          userPassword: password,
        };
        const response = await login(payload, signal);
        const user = response;
        dispatch(
          setSession({
            userId: user.userId,
            userName: user.userName,
            userEmail: user.userEmail,
            userPhone: user.userPhone,
          }),
        );
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home' as never,
            },
          ],
        });
      } catch (e) {
        const catchError =
          e instanceof Error || e instanceof TypeError
            ? e
            : new Error('An unexpected error occurred');
        setError(catchError);
      } finally {
        setIsLoggingIn(false);
      }
    },
    [phone, password, dispatch, navigation, isLoggingIn],
  );

  const abortController = useRef<AbortController | null>(null);
  useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current?.abort();
    };
  }, []);

  useEffect(() => {
    const signal = abortController.current?.signal;
    fetchLogin(signal);
  }, [fetchLogin]);

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <SimpleHeader />
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
            height: frame.width / 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../assets/images/copek.png')} style={{ width: frame.width / 2 - 20, height: frame.width / 2 - 20 }} />
          </View>
        </View>
        {error && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <Icon
              name="triangle-exclamation"
              size={14}
              color={themeColors.red}
            />
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                color: themeColors.red,
              }}
            >
              {error.message}
            </Text>
          </View>
        )}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 13 }}>No. Handphone</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: inputErrors.phone
                  ? themeColors.red
                  : themeColors.borderColor,
              }}
            >
              <View style={{ justifyContent: 'center', paddingRight: 8 }}>
                <Text style={{ color: themeColors.gray, fontWeight: 'bold' }}>
                  +62
                </Text>
              </View>
              <TextInput
                placeholderTextColor={themeColors.gray}
                placeholder="81234567890"
                keyboardType="number-pad"
                value={phone}
                onFocus={() => {
                  setInputErrors(prev => ({
                    ...prev,
                    phone: '',
                  }));
                }}
                onChangeText={setPhone}
                readOnly={isLoggingIn}
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 8,
                  flex: 1,
                  fontFamily: 'Yantramanav',
                  letterSpacing: 1,
                  color: themeColors.black,
                }}
              />
            </View>
            {inputErrors.phone && (
              <Text
                style={{ color: themeColors.red, fontSize: 12, marginTop: 4 }}
              >
                {inputErrors.phone}
              </Text>
            )}
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13 }}>Kata Sandi</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: inputErrors.password
                  ? themeColors.red
                  : themeColors.borderColor,
              }}
            >
              <TextInput
                autoCapitalize="none"
                placeholder="••••••••"
                placeholderTextColor={themeColors.gray}
                secureTextEntry={isSecurePass}
                value={password}
                onChangeText={setPassword}
                readOnly={isLoggingIn}
                onFocus={() => {
                  setInputErrors(prev => ({
                    ...prev,
                    password: '',
                  }));
                }}
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 8,
                  flex: 1,
                  fontFamily: 'Yantramanav',
                  letterSpacing: isSecurePass || !password ? 5 : 1,
                  color: themeColors.black,
                }}
              />
              <Pressable
                onPress={() => {
                  setIsSecurePass(!isSecurePass);
                }}
              >
                <View style={{ paddingVertical: 5 }}>
                  <View
                    style={{
                      width: 40,
                      borderLeftWidth: 1,
                      flex: 1,
                      borderLeftColor: themeColors.borderColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      color={themeColors.black}
                      name={isSecurePass ? 'eye-slash' : 'eye'}
                      size={15}
                    />
                  </View>
                </View>
              </Pressable>
            </View>
            {inputErrors.password && (
              <Text
                style={{ color: themeColors.red, fontSize: 12, marginTop: 4 }}
              >
                {inputErrors.password}
              </Text>
            )}
          </View>
          <Pressable disabled={isLoggingIn} onPress={handleLogin}>
            <View
              style={{
                backgroundColor: themeColors.red,
                paddingVertical: 12,
                borderRadius: 100,
                alignItems: 'center',
                opacity: isLoggingIn ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  color: colorYiq(themeColors.red),
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {isLoggingIn ? 'Loading...' : 'Masuk'}
              </Text>
            </View>
          </Pressable>
          <View style={{ paddingHorizontal: 30, marginTop: 10 }}>
            <Pressable
              onPress={() => console.log('Forgot password pressed')}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, textAlign: 'center' }}>
                  Reset kata sandi?
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          alignItems: 'center',
          borderTopColor: themeColors.borderColor,
          borderTopWidth: 1,
        }}
      >
        <Pressable
          onPress={() => {
            navigation.navigate('Register');
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 13 }}>Tidak punya akun? </Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 13,
              }}
            >
              Buat akun.
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
