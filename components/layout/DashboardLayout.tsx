'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SideMenu, { drawerWidth } from './SideMenu';
import Header from './Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ffffff' }}>
      <SideMenu />
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: '#ffffff',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            px: 3,
            pb: 5,
          }}
        >
          <Header />
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
