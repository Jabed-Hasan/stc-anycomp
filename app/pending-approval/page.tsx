'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Paper, Typography, Button, Alert } from '@mui/material';
import { HourglassEmpty, AdminPanelSettings } from '@mui/icons-material';
import { logout, getUser, isAuthenticated } from '@/lib/auth/authUtils';

export default function PendingApprovalPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // If user has PROVIDER or ADMIN role, redirect to appropriate dashboard
    const user = getUser();
    if (user?.role === 'ADMIN') {
      router.push('/admin/specialists');
    } else if (user?.role === 'PROVIDER') {
      router.push('/specialists');
    }
    // Otherwise, stay on pending approval page
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#FFF3E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <HourglassEmpty sx={{ fontSize: 40, color: '#F57C00' }} />
          </Box>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            Account Pending Approval
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your account has been created successfully, but you need admin approval to access the system.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              What's Next?
            </Typography>
            <Typography variant="body2">
              Please contact the system administrator to assign you a proper role based on your responsibilities. Once approved, you will be able to access all features.
            </Typography>
          </Alert>

          <Box
            sx={{
              bgcolor: '#F5F5F5',
              p: 2,
              borderRadius: 1,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <AdminPanelSettings sx={{ fontSize: 20, color: '#666' }} />
              <Typography variant="body2" fontWeight={600}>
                Admin Approval Required
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              An administrator needs to assign you a role (Provider, Admin, etc.) before you can proceed.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={logout}
            fullWidth
            sx={{
              bgcolor: '#002F70',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              '&:hover': {
                bgcolor: '#001f4d',
              },
            }}
          >
            Logout
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            If you believe this is an error, please contact support.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
