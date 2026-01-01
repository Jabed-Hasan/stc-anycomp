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
  },
  typography: {
    fontFamily: 'var(--font-red-hat-display), Red Hat Display, Proxima Nova, sans-serif',
    allVariants: {
      color: '#222222',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: '#222222',
        },
      },
    },
  },
});

export default theme;
