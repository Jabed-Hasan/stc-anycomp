'use client';

import { Chip } from '@mui/material';

type ApprovalStatus = 'approved' | 'under_review' | 'rejected' | 'pending' | 'Approved' | 'Under Review' | 'Rejected';
type PublishStatus = 'Published' | 'Not Published';

interface StatusBadgeProps {
  status: ApprovalStatus | PublishStatus | string;
  type: 'approval' | 'publish';
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  // Normalize status for consistency
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;

  const getColor = () => {
    if (type === 'approval') {
      switch (normalizedStatus) {
        case 'approved':
          return { bg: '#d4edda', color: '#155724', label: 'Approved' };
        case 'under_review':
        case 'under review':
          return { bg: '#d1ecf1', color: '#0c5460', label: 'Under Review' };
        case 'rejected':
          return { bg: '#f8d7da', color: '#721c24', label: 'Rejected' };
        case 'pending':
          return { bg: '#fff3cd', color: '#856404', label: 'Pending' };
        default:
          return { bg: '#e2e3e5', color: '#383d41', label: status };
      }
    } else {
      switch (normalizedStatus) {
        case 'published':
          return { bg: '#28a745', color: '#ffffff', label: 'Published' };
        case 'not published':
          return { bg: '#dc3545', color: '#ffffff', label: 'Not Published' };
        default:
          return { bg: '#6c757d', color: '#ffffff', label: status };
      }
    }
  };

  const colors = getColor();

  return (
    <Chip
      label={colors.label}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: '24px',
        borderRadius: '4px',
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
}
