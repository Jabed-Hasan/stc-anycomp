'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DrawIcon from '@mui/icons-material/Draw';
import MailIcon from '@mui/icons-material/Mail';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const drawerWidth = 220;

const mainMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { text: 'Specialists', icon: <PeopleIcon />, href: '/specialists' },
  { text: 'Clients', icon: <PeopleIcon />, href: '/clients' },
  { text: 'Service Orders', icon: <LocalShippingIcon />, href: '/service-orders' },
  { text: 'eSignature', icon: <DrawIcon />, href: '/esignature' },
  { text: 'Messages', icon: <MailIcon />, href: '/messages' },
  { text: 'Invoices & Receipts', icon: <ReceiptIcon />, href: '/invoices' },
];

const secondaryMenuItems = [
  { text: 'Help', icon: <HelpOutlineIcon />, href: '/help' },
  { text: 'Settings', icon: <SettingsIcon />, href: '/settings' },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        width: drawerWidth,
        minWidth: drawerWidth,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
          Profile
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
            GL
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Gwen Lam
            </Typography>
            <Typography variant="caption" color="primary" sx={{ fontSize: '0.7rem' }}>
              ST Comp Holdings Sdn Bhd
            </Typography>
          </Box>
        </Stack>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2, pt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
          Dashboard
        </Typography>
      </Box>
      
      <List sx={{ px: 1, pt: 0 }}>
        {mainMenuItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/specialists' && pathname === '/');
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#e8eef7',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#002F70',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#001f4d',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? 'white' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List sx={{ px: 1, py: 1 }}>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
