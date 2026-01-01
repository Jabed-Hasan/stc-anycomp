'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, Paper, Grid } from '@mui/material';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Services
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Clients
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600}>
                RM 0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
