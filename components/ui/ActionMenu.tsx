'use client';

import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { MoreVert, Edit, Delete, CheckCircle, Cancel, RateReview } from '@mui/icons-material';
import { useState } from 'react';

interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSubmitReview?: () => void;
}

export default function ActionMenu({ onEdit, onDelete, onApprove, onReject, onSubmitReview }: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.();
    handleClose();
  };

  const handleDelete = () => {
    onDelete?.();
    handleClose();
  };

  const handleApprove = () => {
    onApprove?.();
    handleClose();
  };

  const handleReject = () => {
    onReject?.();
    handleClose();
  };

  const handleSubmitReview = () => {
    onSubmitReview?.();
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVert fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {[
          onEdit && (
            <MenuItem key="edit" onClick={handleEdit}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          ),
          
          (onApprove || onReject || onSubmitReview) && <Divider key="divider1" />,
          
          onSubmitReview && (
            <MenuItem key="submitReview" onClick={handleSubmitReview} sx={{ color: 'info.main' }}>
              <ListItemIcon>
                <RateReview fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText>Submit for Review</ListItemText>
            </MenuItem>
          ),
          
          onApprove && (
            <MenuItem key="approve" onClick={handleApprove} sx={{ color: 'success.main' }}>
              <ListItemIcon>
                <CheckCircle fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Approve</ListItemText>
            </MenuItem>
          ),
          
          onReject && (
            <MenuItem key="reject" onClick={handleReject} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Cancel fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Reject</ListItemText>
            </MenuItem>
          ),
          
          onDelete && <Divider key="divider2" />,
          
          onDelete && (
            <MenuItem key="delete" onClick={handleDelete} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Delete fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          ),
        ].filter(Boolean)}
      </Menu>
    </>
  );
}
