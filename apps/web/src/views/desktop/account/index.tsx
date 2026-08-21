'use client';

import { useState, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
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
  TextField,
  Typography
} from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCardOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GradientButton, OutlinedButton } from '@/components';
import { getUserInitials } from '@/utils';

function ProfileField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}): ReactNode {
  return (
    <Stack spacing={0.75}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        value={value}
        onChange={event => onChange(event.target.value)}
        size="medium"
      />
    </Stack>
  );
}

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

  const [fullName, setFullName] = useState(
    [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(' ')
  );
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

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

            <Grid container spacing={2.5}>
              <Grid size={6}>
                <ProfileField
                  label="Full name"
                  value={fullName}
                  onChange={setFullName}
                />
              </Grid>
              <Grid size={6}>
                <ProfileField
                  label="Email"
                  value={email}
                  onChange={setEmail}
                />
              </Grid>
              <Grid size={6}>
                <ProfileField
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                />
              </Grid>
              <Grid size={6}>
                <ProfileField
                  label="City"
                  value={city}
                  onChange={setCity}
                />
              </Grid>
            </Grid>

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
                <GradientButton sx={{ height: 44, px: 3 }}>
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
