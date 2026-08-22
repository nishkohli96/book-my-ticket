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
import WhatshotIcon from '@mui/icons-material/Whatshot';
import type { EditProfileFormData, UserProfileDetails } from '@book-my-ticket/common';
import { OutlinedButton } from '@/components';
import { getUserInitials } from '@/utils';
import EditProfileForm from '@/views/common/edit-profile';

const editProfileFormId = 'edit-profile-form';

type AccountPageDesktopProps = {
  initialProfile: UserProfileDetails | null;
};

const navItems = [
  { key: 'profile', label: 'Profile', icon: <PersonOutlineIcon /> },
  { key: 'payment', label: 'Payment methods', icon: <CreditCardIcon /> },
  { key: 'notifications', label: 'Notifications', icon: <NotificationsNoneIcon /> },
  { key: 'security', label: 'Security', icon: <LockOutlinedIcon /> },
] as const;

export default function AccountPageDesktop({ initialProfile }: AccountPageDesktopProps) {
  const {
    data: session,
    update: updateSession
  } = useSession();
  const [activeTab, setActiveTab] = useState<(typeof navItems)[number]['key']>('profile');
  const initials = getUserInitials(session?.user?.firstName, session?.user?.lastName);

  const onSubmit = async (data: EditProfileFormData) => {
    const response = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      toast.error(result.message ?? 'Something went wrong. Please try again.');
      return;
    }

    await updateSession({
      firstName: result.data.firstName,
      lastName: result.data.lastName
    });
    toast.success('Profile updated');
  };

  return (
    <Box sx={{ mx: 'auto', px: 4, py: 5 }}>
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

            {initialProfile
              ? (
                <EditProfileForm
                  formId={editProfileFormId}
                  defaultValues={initialProfile}
                  onSubmit={onSubmit}
                />
              )
              : (
                <Typography color="error.main" sx={{ py: 4 }}>
                  Failed to load profile. Please refresh the page.
                </Typography>
              )}
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              mt: 3,
              borderRadius: '16px',
              borderColor: 'error.main',
              p: 4,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <WhatshotIcon sx={{ color: 'error.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'error.main' }}>
                Danger zone
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Stack spacing={0.25}>
                <Typography sx={{ fontWeight: 700 }}>
                  Delete account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permanently remove your account and all of its data. This cannot be undone.
                </Typography>
              </Stack>
              <OutlinedButton
                sx={{
                  height: 44,
                  px: 3,
                  color: 'error.main',
                  borderColor: 'var(--mui-palette-error-main) !important',
                  '&:hover': { backgroundColor: 'rgba(var(--mui-palette-error-mainChannel) / 0.04)' },
                }}
              >
                Delete account
              </OutlinedButton>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
