import { createTheme } from '@shopify/restyle';

const palette = {
  purple: '#5A31F4',
  white: '#FFF',
  black: '#111',
  darkGray: '#333',
  gray: '#666',
  lightGray: '#EEE',
  red: '#FF0058',
  green: '#00C851',
};

export const theme = createTheme({
  colors: {
    primary: '#9ACD32',
    secondary: '#FF8C00',
    background: '#FFFFFF',
    foreground: '#F7F7F7',
    text: '#1A1A1A',
    textSecondary: '#757575',
    inputBackground: '#F0F0F0',
    error: '#FF4444',
    success: '#4CAF50',
    white: '#FFFFFF',
    cardPrimary: '#F8F9FA',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 34,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

export type Theme = typeof theme;

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.black,
    foreground: palette.white,
    text: palette.white,
    textSecondary: palette.lightGray,
    inputBackground: palette.darkGray,
  },
};