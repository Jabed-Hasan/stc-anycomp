'use client';

import { Box, Typography, Paper } from '@mui/material';

export default function DashboardPage() {
  return (
 
      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Dashboard
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={600}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Services
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={600}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Clients
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={600}>
              RM 0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
          </Paper>
        </Box>
      </Box>
  
  );
}
