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
  Pagination,
} from '@mui/material';
import { Search, Add, FileDownload } from '@mui/icons-material';
import { useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionMenu from '@/components/ui/ActionMenu';
import { mockServices, Service } from '@/lib/data/mockData';

export default function SpecialistsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedServices(mockServices.map((s) => s.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
      <Box sx={{ width: '100%' }}>
      {/* Breadcrumb */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Dashboard
      </Typography>

      {/* Page Title */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        Services
      </Typography>

      {/* Subtitle */}
      <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
        Specialists
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create and publish your services for Client's & Companies
      </Typography>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="All" />
        <Tab label="Drafts" />
        <Tab label="Published" />
      </Tabs>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          id="search-services"
          placeholder="Search Services"
          size="small"
          sx={{ width: 300, bgcolor: 'white' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#002F70',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#001f4d',
              },
            }}
          >
            Create
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            sx={{
              bgcolor: '#1e293b',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#0f172a',
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedServices.length === mockServices.length}
                  indeterminate={selectedServices.length > 0 && selectedServices.length < mockServices.length}
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
            {mockServices.map((service) => (
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
                <TableCell sx={{ fontSize: '0.875rem' }}>{service.name}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>RM {service.price.toLocaleString()}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{service.purchases}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{service.duration}</TableCell>
                <TableCell>
                  <StatusBadge status={service.approvalStatus} type="approval" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={service.publishStatus} type="publish" />
                </TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => console.log('Edit', service.id)}
                    onDelete={() => console.log('Delete', service.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={10}
          page={page}
          onChange={(e, value) => setPage(value)}
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: '0.875rem',
            },
            '& .Mui-selected': {
              bgcolor: '#002F70 !important',
              color: 'white',
              '&:hover': {
                bgcolor: '#001f4d !important',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
