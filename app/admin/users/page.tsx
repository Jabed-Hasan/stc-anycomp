'use client';

import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add, MoreVert, PersonAdd, AdminPanelSettings, Business } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/auth/fetchWithAuth';

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [assignType, setAssignType] = useState<'admin' | 'provider'>('provider');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'BLOCKED' | 'DELETED'>('ACTIVE');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://stc-supabase.vercel.app/api/v1/users/all');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({ open: true, message: 'Failed to fetch users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetchWithAuth('https://stc-supabase.vercel.app/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
        setCreateDialog(false);
        setNewUser({ email: '', password: '', name: '', phoneNumber: '' });
        fetchUsers();
      } else {
        setSnackbar({ open: true, message: data.message || 'Failed to create user', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating user', severity: 'error' });
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser) return;

    try {
      const endpoint = assignType === 'admin' 
        ? 'https://stc-supabase.vercel.app/api/v1/users/create-admin'
        : 'https://stc-supabase.vercel.app/api/v1/providers/create-provider';

      const response = await fetchWithAuth(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedUser.email }),
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({ 
          open: true, 
          message: `User assigned as ${assignType.toUpperCase()} successfully!`, 
          severity: 'success' 
        });
        setAssignDialog(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        setSnackbar({ open: true, message: data.message || 'Failed to assign role', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error assigning role', severity: 'error' });
    }
  };

  const openAssignDialog = (type: 'admin' | 'provider') => {
    setAssignType(type);
    setAssignDialog(true);
    handleMenuClose();
  };

  const openStatusDialog = () => {
    if (selectedUser) {
      setNewStatus(selectedUser.status as 'ACTIVE' | 'BLOCKED' | 'DELETED');
      setStatusDialog(true);
      handleMenuClose();
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetchWithAuth(
        `https://stc-supabase.vercel.app/api/v1/users/${selectedUser.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSnackbar({ 
          open: true, 
          message: `User status changed to ${newStatus} successfully!`, 
          severity: 'success' 
        });
        setStatusDialog(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        setSnackbar({ open: true, message: data.message || 'Failed to change status', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error changing user status', severity: 'error' });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'SUPER_ADMIN': return 'secondary';
      case 'PROVIDER': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'BLOCKED': return 'error';
      case 'DELETED': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage users and assign roles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
          sx={{
            bgcolor: '#002F70',
            textTransform: 'none',
            '&:hover': { bgcolor: '#001f4d' },
          }}
        >
          Create User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 600 }}>NAME</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>PHONE</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CREATED AT</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={getRoleColor(user.role)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        color={getStatusColor(user.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => openAssignDialog('admin')}>
          <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} />
          Assign as Admin
        </MenuItem>
        <MenuItem onClick={() => openAssignDialog('provider')}>
          <Business sx={{ mr: 1, fontSize: 20 }} />
          Assign as Provider
        </MenuItem>
        <MenuItem onClick={openStatusDialog}>
          <PersonAdd sx={{ mr: 1, fontSize: 20 }} />
          Change Status
        </MenuItem>
      </Menu>

      {/* Create User Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              placeholder="+60123456789"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateUser}
            disabled={!newUser.email || !newUser.password}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Assign as {assignType === 'admin' ? 'Admin' : 'Provider'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to assign <strong>{selectedUser?.email}</strong> as{' '}
            <strong>{assignType === 'admin' ? 'ADMIN' : 'PROVIDER'}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssignRole}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change User Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value as 'ACTIVE' | 'BLOCKED' | 'DELETED')}
              >
                <MenuItem value="ACTIVE">ACTIVE - Can login and use system</MenuItem>
                <MenuItem value="BLOCKED">BLOCKED - Cannot login (suspended)</MenuItem>
                <MenuItem value="DELETED">DELETED - Soft delete account</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Change status for <strong>{selectedUser?.email}</strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangeStatus}>
            Change Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
