'use client';

import { Box, Typography, Paper } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3 
      }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Total Services</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>0</Typography>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Pending Review</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>0</Typography>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Approved</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>0</Typography>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Total Providers</Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>0</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
