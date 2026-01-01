'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Home() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
          Welcome to Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your services, clients, and orders all in one place
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/specialists')}
          sx={{ textTransform: 'none', px: 4, py: 1.5 }}
        >
          View Specialists
        </Button>
      </Box>
    </DashboardLayout>
  );
}

