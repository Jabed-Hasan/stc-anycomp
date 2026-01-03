'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getAccessToken, isTokenExpired, logout, getUser } from '@/lib/auth/authUtils';
import { Box, CircularProgress } from '@mui/material';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        router.push('/login');
        return;
      }

      // Check if user has PROVIDER or ADMIN role
      const user = getUser();
      const validRoles = ['PROVIDER', 'ADMIN'];
      const hasValidRole = user?.role && validRoles.includes(user.role);
      
      if (!hasValidRole) {
        // User doesn't have PROVIDER or ADMIN role, redirect to pending approval page
        if (pathname !== '/pending-approval') {
          router.push('/pending-approval');
          return;
        }
        setHasRole(false);
      } else {
        setHasRole(true);
      }
      
      setIsChecking(false);
    };

    checkAuth();

    // Set up periodic token expiration check (every 30 seconds)
    const intervalId = setInterval(() => {
      const token = getAccessToken();
      
      if (!token) {
        console.log('No token found, logging out');
        logout();
        return;
      }

      if (isTokenExpired(token)) {
        console.log('Token expired, logging out automatically');
        logout();
      }
    }, 30000); // Check every 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Only render children if user has a role (or is on pending approval page)
  if (!hasRole && pathname !== '/pending-approval') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
