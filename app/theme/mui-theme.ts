'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#222222',
    },
    text: {
      primary: '#222222',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Red Hat Display, Proxima Nova, sans-serif',
    allVariants: {
      color: '#222222',
    },
  },
});

export default theme;
