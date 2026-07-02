/**
 * https://mui.com/material-ui/customization/css-theme-variables/configuration/
 * https://mui.com/material-ui/customization/dark-mode/
 */

'use client';

import { createTheme, type Theme } from '@mui/material/styles';
import {
  LightThemePalette,
  DarkThemePalette,
  CommonColorPalette
} from './palette';
import { colorSchemeAttribute } from './constants';
import { plusJakartaSans } from './fonts';

export const theme: Theme = createTheme({
  cssVariables: {
    colorSchemeSelector: colorSchemeAttribute,
  },
  colorSchemes: {
    light: {
      palette: {
        ...CommonColorPalette,
        ...LightThemePalette,
      },
    },
    dark: {
      palette: {
        ...CommonColorPalette,
        ...DarkThemePalette,
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 350,
      md: 768,
      lg: 1024,
      xl: 1400,
    },
  },
  typography: {
    fontFamily: plusJakartaSans.style.fontFamily,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 700,
      textTransform: 'none'
    }
  },
});
