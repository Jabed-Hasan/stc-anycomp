'use client';

import { Chip } from '@mui/material';

type ApprovalStatus = 'Approved' | 'Under Review' | 'Rejected';
type PublishStatus = 'Published' | 'Not Published';

interface StatusBadgeProps {
  status: ApprovalStatus | PublishStatus;
  type: 'approval' | 'publish';
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const getColor = () => {
    if (type === 'approval') {
      switch (status) {
        case 'Approved':
          return { bg: '#d4edda', color: '#155724' };
        case 'Under Review':
          return { bg: '#d1ecf1', color: '#0c5460' };
        case 'Rejected':
          return { bg: '#f8d7da', color: '#721c24' };
        default:
          return { bg: '#e2e3e5', color: '#383d41' };
      }
    } else {
      switch (status) {
        case 'Published':
          return { bg: '#28a745', color: '#ffffff' };
        case 'Not Published':
          return { bg: '#dc3545', color: '#ffffff' };
        default:
          return { bg: '#6c757d', color: '#ffffff' };
      }
    }
  };

  const colors = getColor();

  return (
    <Chip
      label={status}
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
