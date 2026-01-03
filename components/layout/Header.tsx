'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pt: 1.5,
        px: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        bgcolor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Stack direction="row" spacing={1}>
        <IconButton size="small">
          <MailIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <Badge badgeContent={1} color="error">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
        <IconButton size="small">
          <AccountCircleIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
