'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import {
  Avatar,
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCardOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import type { EditProfileFormData } from '@book-my-ticket/common';
import { GradientButton, OutlinedButton } from '@/components';
import { getUserInitials } from '@/utils';
import EditProfileForm from '@/views/common/edit-profile';

const editProfileFormId = 'edit-profile-form';

const navItems = [
  { key: 'profile', label: 'Profile', icon: <PersonOutlineIcon /> },
  { key: 'payment', label: 'Payment methods', icon: <CreditCardIcon /> },
  { key: 'notifications', label: 'Notifications', icon: <NotificationsNoneIcon /> },
  { key: 'security', label: 'Security', icon: <LockOutlinedIcon /> },
] as const;

export default function AccountPageDesktop() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<(typeof navItems)[number]['key']>('profile');
  const initials = getUserInitials(session?.user?.firstName, session?.user?.lastName);

  const defaultValues: EditProfileFormData = {
    firstName: session?.user?.firstName ?? '',
    lastName: session?.user?.lastName ?? '',
    email: session?.user?.email ?? '',
    phoneNumber: { phone: '', country: '', dialCode: '', phoneNo: '' },
  };

  const onSubmit = (data: EditProfileFormData) => {
    // TODO: wire up to a real update-profile endpoint once it exists.
    toast.success('Profile updated');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 5 }}>
      <Stack
        direction="row"
        sx={{ mb: 4, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme => theme.palette.gradients.brandPrimary,
              color: 'white',
            }}
          >
            <ManageAccountsIcon />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Account settings
          </Typography>
        </Stack>
        <Avatar
          sx={{
            background: theme => theme.palette.gradients.brandPrimary,
            color: 'white',
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={3}>
          <Paper variant="outlined" sx={{ borderRadius: '16px', p: 1.5 }}>
            <List disablePadding>
              {navItems.map(item => (
                <ListItemButton
                  key={item.key}
                  selected={activeTab === item.key}
                  onClick={() => setActiveTab(item.key)}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primaryTint',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: { sx: { fontWeight: activeTab === item.key ? 700 : 500 } }
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={9}>
          <Paper variant="outlined" sx={{ borderRadius: '16px', p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your personal details and how we reach you.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: 28,
                  background: theme => theme.palette.gradients.brandPrimary,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Stack spacing={0.5}>
                <OutlinedButton sx={{ height: 40, px: 2.5 }}>
                  Change photo
                </OutlinedButton>
                <Typography variant="caption" color="text.secondary">
                  JPG or PNG, max 4MB
                </Typography>
              </Stack>
            </Stack>

            <EditProfileForm
              formId={editProfileFormId}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
            />

            <Stack
              direction="row"
              sx={{
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={1.5}>
                <GradientButton
                  type="submit"
                  sx={{ height: 44, px: 3 }}
                >
                  Save changes
                </GradientButton>
                <OutlinedButton sx={{ height: 44, px: 3 }}>
                  Cancel
                </OutlinedButton>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: 'error.main', fontWeight: 700, cursor: 'pointer' }}
              >
                Delete account
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
