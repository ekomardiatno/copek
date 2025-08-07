const colors = {
  black: '#2f2f2f',
  white: '#fff',
  grayLighter: '#f5f5f5',
  grayLight: '#efefef',
  gray: '#7e7e7e',
  grayDark: '#353940',
  blue: '#394dbd',
  yellow: '#ffd71d',
  green: '#2c9e6d',
  purple: '#96339c',
  pink: '#bd3f9c',
  teal: '#24b4ce',
  cean: '#38d8ad',
  red: '#d23454'
}

export const themeColors = {
  ...colors,
  primary: colors.yellow,
  secondary: '#a78f27',
  textColor: colors.black,
  textMuted: '#8a8a8a',
  borderColor: '#eee',
  borderColorGray: '#ddd'
}

export const REDUX_KEY_NAME = 'copekReduxPersist'