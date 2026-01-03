/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Search, FileDownload } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { isTokenExpired } from '@/lib/auth/tokenRefresh';
import {
  fetchAllSpecialistsAdmin,
  fetchDraftsAdmin,
  fetchPublishedAdmin,
  approveSpecialist,
  rejectSpecialist,
  deleteSpecialist,
  submitForReview,
} from '@/lib/redux/slices/specialistsSlice';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionMenu from '@/components/ui/ActionMenu';

export default function AdminSpecialistsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { specialists, loading, error, meta } = useAppSelector((state) => state.specialists);

  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [rejectDialog, setRejectDialog] = useState({ open: false, id: '', reason: '' });

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (isTokenExpired(token)) {
      console.error('Token is expired, redirecting to login');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }
  }, [router]);

  // Fetch data based on tab
  useEffect(() => {
    fetchData();
  }, [tabValue, page, searchTerm]);

  const fetchData = () => {
    const params = { page, limit: 10, searchTerm };
    
    if (tabValue === 0) {
      // All
      dispatch(fetchAllSpecialistsAdmin(params));
    } else if (tabValue === 1) {
      // Drafts
      dispatch(fetchDraftsAdmin(params));
    } else if (tabValue === 2) {
      // Published
      dispatch(fetchPublishedAdmin(params));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1);
    setSelectedServices([]);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedServices(specialists.map((s) => s.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApprove = async (id: string) => {
    try {
      await dispatch(approveSpecialist(id)).unwrap();
      setSnackbar({ open: true, message: 'Specialist approved successfully!', severity: 'success' });
      fetchData();
    } catch (err: any) {
      setSnackbar({ open: true, message: err || 'Failed to approve specialist', severity: 'error' });
    }
  };

  const handleSubmitReview = async (id: string) => {
    try {
      await dispatch(submitForReview(id)).unwrap();
      setSnackbar({ open: true, message: 'Specialist submitted for review successfully!', severity: 'success' });
      fetchData();
    } catch (err: any) {
      setSnackbar({ open: true, message: err || 'Failed to submit for review', severity: 'error' });
    }
  };

  const handleRejectOpen = (id: string) => {
    setRejectDialog({ open: true, id, reason: '' });
  };

  const handleRejectConfirm = async () => {
    try {
      await dispatch(rejectSpecialist({ id: rejectDialog.id, reason: rejectDialog.reason })).unwrap();
      setSnackbar({ open: true, message: 'Specialist rejected', severity: 'success' });
      setRejectDialog({ open: false, id: '', reason: '' });
      fetchData();
    } catch (err: any) {
      setSnackbar({ open: true, message: err || 'Failed to reject specialist', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this specialist?')) {
      try {
        await dispatch(deleteSpecialist(id)).unwrap();
        setSnackbar({ open: true, message: 'Specialist deleted successfully', severity: 'success' });
        fetchData();
      } catch (err: any) {
        setSnackbar({ open: true, message: err || 'Failed to delete specialist', severity: 'error' });
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Breadcrumb */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Admin Dashboard
      </Typography>

      {/* Page Title */}
      <Typography 
        variant="h5" 
        fontWeight={600} 
        sx={{ 
          mb: 1,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' }
        }}
      >
        Services Management
      </Typography>

      {/* Subtitle */}
      <Typography 
        variant="h6" 
        fontWeight={600} 
        sx={{ 
          mt: 4, 
          mb: 1,
          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
        }}
      >
        All Specialists
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage and review all specialist services from providers
      </Typography>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="All" />
        <Tab label="Drafts" />
        <Tab label="Published" />
      </Tabs>

      {/* Search and Actions */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        gap: 2,
        mb: 3 
      }}>
        <TextField
          id="search-services"
          placeholder="Search Services"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ 
            width: { xs: '100%', sm: 300 }, 
            bgcolor: 'white' 
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2 
        }}>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            fullWidth
            sx={{
              bgcolor: '#1e293b',
              textTransform: 'none',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                bgcolor: '#0f172a',
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      {!loading && (
        <>
          <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
              border: '1px solid', 
              borderColor: 'divider',
              overflowX: 'auto'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={specialists.length > 0 && selectedServices.length === specialists.length}
                      indeterminate={selectedServices.length > 0 && selectedServices.length < specialists.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>SERVICE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>PRICE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>PURCHASES</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>DURATION</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>APPROVAL STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>PUBLISH STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {specialists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No specialists found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  specialists.map((service) => (
                    <TableRow
                      key={service.id}
                      sx={{
                        '&:hover': { bgcolor: '#fafafa' },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleSelectOne(service.id)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>{service.title}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>RM {parseFloat(service.base_price).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>0</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>{service.duration_days} Day{service.duration_days > 1 ? 's' : ''}</TableCell>
                      <TableCell>
                        <StatusBadge status={service.verification_status} type="approval" />
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={service.is_draft ? 'Not Published' : 'Published'} 
                          type="publish" 
                        />
                      </TableCell>
                      <TableCell>
                        <ActionMenu
                          onEdit={() => router.push(`/specialists/edit/${service.id}`)}
                          onDelete={() => handleDelete(service.id)}
                          onSubmitReview={
                            service.verification_status === 'pending'
                              ? () => handleSubmitReview(service.id)
                              : undefined
                          }
                          onApprove={
                            (service.verification_status === 'under_review' || 
                             service.verification_status === 'pending' ||
                             service.verification_status === 'rejected')
                              ? () => handleApprove(service.id) 
                              : undefined
                          }
                          onReject={
                            (service.verification_status === 'under_review' || 
                             service.verification_status === 'pending')
                              ? () => handleRejectOpen(service.id) 
                              : undefined
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {specialists.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
              <Button
                variant="text"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ 
                  textTransform: 'none', 
                  color: page === 1 ? 'text.disabled' : 'text.primary',
                  minWidth: 'auto'
                }}
              >
                Previous
              </Button>
              
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {Array.from({ length: meta.totalPage || 1 }, (_, i) => i + 1).map((pageNum) => {
                  const showPage = pageNum === 1 || 
                                   pageNum === meta.totalPage || 
                                   Math.abs(pageNum - page) <= 1;
                  
                  const showEllipsis = (pageNum === 2 && page > 3) || 
                                      (pageNum === meta.totalPage - 1 && page < meta.totalPage - 2);

                  if (showEllipsis) {
                    return (
                      <Typography key={`ellipsis-${pageNum}`} sx={{ px: 1, py: 0.5 }}>
                        ...
                      </Typography>
                    );
                  }

                  if (!showPage && pageNum !== 2 && pageNum !== meta.totalPage - 1) {
                    return null;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'contained' : 'text'}
                      onClick={() => setPage(pageNum)}
                      sx={{
                        minWidth: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        p: 0,
                        bgcolor: page === pageNum ? '#002F70' : 'transparent',
                        color: page === pageNum ? 'white' : 'text.primary',
                        '&:hover': {
                          bgcolor: page === pageNum ? '#001f4d' : 'rgba(0, 47, 112, 0.08)',
                        },
                      }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </Box>

              <Button
                variant="text"
                disabled={page === meta.totalPage}
                onClick={() => setPage(page + 1)}
                sx={{ 
                  textTransform: 'none',
                  color: page === meta.totalPage ? 'text.disabled' : 'text.primary',
                  minWidth: 'auto'
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, id: '', reason: '' })}>
        <DialogTitle>Reject Specialist</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejection:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            placeholder="Enter rejection reason..."
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, id: '', reason: '' })}>Cancel</Button>
          <Button 
            onClick={handleRejectConfirm} 
            variant="contained" 
            color="error"
            disabled={!rejectDialog.reason}
          >
            Reject
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
