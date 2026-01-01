'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from '@/app/theme/mui-theme';
import StoreProvider from '@/lib/redux/StoreProvider';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </StoreProvider>
  );
}
