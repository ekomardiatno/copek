/* eslint-disable react-native/no-inline-styles */
import { JSX, useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themeColors } from '../constants';
import SimpleHeader from '../components/SimpleHeader';
import { colorYiq } from '../utils';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/Icon';
import { register } from '../services/auth-services';

export default function RegisterScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<Error | TypeError | null>(
    null,
  );
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleRegister = () => {
    if (!name || !phone || !email || !password || !rePassword) {
      setInputErrors({
        name: !name ? 'Name is required' : '',
        phone: !phone ? 'Phone number is required' : '',
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
        rePassword: !rePassword ? 'Please confirm your password' : '',
      });
      return;
    }
    if (password !== rePassword) {
      setInputErrors({
        ...inputErrors,
        rePassword: 'Passwords do not match',
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
    setIsRegistering(true);
  };

  const fetchRegister = useCallback(
    async (signal: AbortSignal) => {
      if (!isRegistering) return;
      setRegisterError(null);
      try {
        const payload = {
          userName: name,
          userPhone: phone,
          userEmail: email,
          userPassword: password,
        };
        await register(signal, payload);
        navigation.goBack();
        ToastAndroid.show('Akun berhasil dibuat', ToastAndroid.SHORT);
      } catch (e) {
        const catchError =
          e instanceof Error || e instanceof TypeError
            ? e
            : new Error('An unexpected error occurred');
        setRegisterError(catchError);
      }
      setIsRegistering(false);
    },
    [password, name, phone, email, navigation, isRegistering],
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchRegister(signal);
    return () => {
      controller.abort();
    };
  }, [fetchRegister]);

  return (
    <>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <SimpleHeader title="Buat Akun" />
        <ScrollView>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 13 }}>Nama Lengkap</Text>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: inputErrors.name
                    ? themeColors.red
                    : themeColors.borderColor,
                }}
              >
                <TextInput
                  placeholderTextColor={themeColors.gray}
                  placeholder="Eko Mardiatno"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                  readOnly={isRegistering}
                  onFocus={() => {
                    setInputErrors(prev => ({
                      ...prev,
                      name: '',
                    }));
                  }}
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical: 6,
                    flex: 1,
                    fontFamily: 'Yantramanav',
                    color: themeColors.black,
                    letterSpacing: 1,
                  }}
                />
              </View>
              {inputErrors.name && (
                <Text
                  style={{ color: themeColors.red, fontSize: 12, marginTop: 4 }}
                >
                  {inputErrors.name}
                </Text>
              )}
            </View>
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
                  onChangeText={setPhone}
                  readOnly={isRegistering}
                  onFocus={() => {
                    setInputErrors(prev => ({
                      ...prev,
                      phone: '',
                    }));
                  }}
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical: 6,
                    flex: 1,
                    fontFamily: 'Yantramanav',
                    color: themeColors.black,
                    letterSpacing: 1,
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
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 13 }}>Alamat Email</Text>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: inputErrors.email
                    ? themeColors.red
                    : themeColors.borderColor,
                }}
              >
                <TextInput
                  placeholderTextColor={themeColors.gray}
                  placeholder="ekomardiatno@domain.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  readOnly={isRegistering}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => {
                    setInputErrors(prev => ({
                      ...prev,
                      email: '',
                    }));
                  }}
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical: 6,
                    flex: 1,
                    fontFamily: 'Yantramanav',
                    color: themeColors.black,
                    letterSpacing: 1,
                  }}
                />
              </View>
              {inputErrors.email && (
                <Text
                  style={{ color: themeColors.red, fontSize: 12, marginTop: 4 }}
                >
                  {inputErrors.email}
                </Text>
              )}
            </View>
            <View style={{ marginBottom: 15 }}>
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
                  placeholderTextColor={themeColors.gray}
                  autoCapitalize="none"
                  placeholder="••••••••"
                  value={password}
                  readOnly={isRegistering}
                  onChangeText={setPassword}
                  onFocus={() => {
                    setInputErrors(prev => ({
                      ...prev,
                      password: '',
                    }));
                  }}
                  secureTextEntry={!showPassword}
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical: 6,
                    flex: 1,
                    fontFamily: 'Yantramanav',
                    color: themeColors.black,
                    letterSpacing: showPassword && password ? 1 : 5,
                  }}
                />
                <TouchableHighlight
                  activeOpacity={0.85}
                  underlayColor="#fff"
                  onPress={() => {
                    setShowPassword(!showPassword);
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
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={15}
                      />
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
              {inputErrors.password && (
                <Text
                  style={{ color: themeColors.red, fontSize: 12, marginTop: 4 }}
                >
                  {inputErrors.password}
                </Text>
              )}
            </View>
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 13 }}>Ulangi Kata Sandi</Text>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: inputErrors.rePassword
                    ? themeColors.red
                    : themeColors.borderColor,
                }}
              >
                <TextInput
                  placeholderTextColor={themeColors.gray}
                  autoCapitalize="none"
                  placeholder="••••••••"
                  readOnly={isRegistering}
                  value={rePassword}
                  onChangeText={setRePassword}
                  secureTextEntry={!showRePassword}
                  onFocus={() => {
                    setInputErrors(prev => ({
                      ...prev,
                      rePassword: '',
                    }));
                  }}
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical: 6,
                    flex: 1,
                    fontFamily: 'Yantramanav',
                    color: themeColors.black,
                    letterSpacing: showRePassword && rePassword ? 1 : 5,
                  }}
                />
                <TouchableHighlight
                  activeOpacity={0.85}
                  underlayColor="#fff"
                  onPress={() => {
                    setShowRePassword(!showRePassword);
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
                        name={showRePassword ? 'eye' : 'eye-slash'}
                        size={15}
                      />
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
              {inputErrors.rePassword && (
                <Text
                  style={{ color: themeColors.red, fontSize: 12, marginTop: 4 }}
                >
                  {inputErrors.rePassword}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={handleRegister} disabled={isRegistering}>
              <View
                style={{
                  backgroundColor: themeColors.red,
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  marginBottom: 15,
                  opacity: isRegistering ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: colorYiq(themeColors.red),
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {isRegistering ? 'Mendaftar...' : 'Daftar'}
                </Text>
              </View>
            </TouchableOpacity>
            {registerError && (
              <View
                style={{
                  marginTop: 15,
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
                  {registerError.message}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderTopColor: themeColors.borderColor,
            borderTopWidth: 1,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.goBack()}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 13 }}>Sudah punya akun? </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 13,
                }}
              >
                Masuk.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
