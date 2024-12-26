import { createTheme } from '@shopify/restyle';

const palette = {
  purple: '#8A2BE2',
  deepPurple: '#9400D3',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#1A1A1A',
  gray: '#333333',
  lightGray: '#666666',
};

const theme = createTheme({
  colors: {
    primary: palette.purple,
    secondary: palette.deepPurple,
    background: palette.black,
    foreground: palette.white,
    inputBackground: palette.darkGray,
    border: palette.gray,
    text: palette.white,
    textSecondary: palette.lightGray,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    s: 8,
    m: 16,
    l: 25,
    xl: 32,
  },
  textVariants: {
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'text',
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: 'text',
    },
    body: {
      fontSize: 16,
      color: 'text',
    },
  },
});

export type Theme = typeof theme;
export default theme;