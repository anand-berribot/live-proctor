import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const primary = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#ffffff',
};

export const warning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: grey[800],
};

export const error = {
  lighter: '#d39761',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};
export const error1 = {
  lighter: '#d39761',
  light: '#FFAC82',
  main: '#FFAC82',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};
export const errorLighter = {
  main: '#d39761',

};
export const errorLight = {

  main: '#FFAC82',

};
export const errorDark = {

  main: '#B71D18',

};
export const errorDarkest = {

  main: '#7A0916',
};
export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};
export const scroll = {
  thumb: grey[300],
  active: grey[400],
  thumb1: '#00A76F',
  active1: '#007867',
};
const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  error1,
  errorLighter,
  errorLight,
  errorDark,
  errorDarkest,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
  scroll
};

// ----------------------------------------------------------------------

export function palette(mode) {
  const light = {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
      button: grey[800],
      none: common.black,
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      neutral: grey[200],
      bg: grey[200],
      bg1: grey[100],
      bg2: '#F9FFFB',
      scroll: scroll.thumb,
      scrollActive: scroll.active,
      timer: grey[100],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
    scroll: {
      thumb: scroll.thumb,
      // thumb: grey[500],
      // track: grey[200],
      active: scroll.active,
    }
  };

  const dark = {
    ...base,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: grey[500],
      disabled: grey[600],
      button: '#61F3F3',
      none: common.white,
    },
    background: {
      paper: grey[800],
      default: grey[900],
      neutral: alpha(grey[500], 0.12),
      bg: 'rgba(255, 255, 255, 0.11)',
      bg1: alpha(grey[900], 0.12),
      bg2: grey[800],
      scroll: scroll.thumb1,
      scrollActive: scroll.active1,
      timer: '#2B3949',
    },
    action: {
      ...base.action,
      active: grey[500],
    },
    scroll: {
      // thumb: scroll.thumb1,
      thumb: grey[600],
      // track: grey[200],
      // active: scroll.active1,
      active: grey[500],
    }
  };

  return mode === 'light' ? light : dark;
}