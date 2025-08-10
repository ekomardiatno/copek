const colors = {
  black: '#030712',
  white: '#f9fafb',
  grayLighter: '#f3f4f6',
  grayLight: '#d1d5db',
  gray: '#4b5563',
  grayDark: '#374151',
  grayDarker: '#1f2937',
  blue: '#1d4ed8',
  yellow: '#a16207',
  green: '#15803d',
  purple: '#7e22ce',
  pink: '#be185d',
  teal: '#0f766e',
  cyan: '#0e7490',
  red: '#b91c1c',
};

export const themeColors = {
  ...colors,
  primary: colors.blue,
  secondary: colors.yellow,
  textColor: colors.black,
  textMuted: '#374151',
  borderColor: '#e5e7eb',
  borderColorGray: '#9ca3af',
};

export const REDUX_KEY_NAME = 'copekReduxPersist'