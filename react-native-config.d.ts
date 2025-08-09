declare module 'react-native-config' {
  export interface NativeConfig {
    NODE_APP_URL?: string;
    WEB_API_URL?: string;
    WEB_APP_HOST?: string;
    GOOGLE_MAPS_API_KEY?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
