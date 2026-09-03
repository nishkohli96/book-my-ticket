'use client';

import { useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  AppBar as MuiAppBar,
  Avatar,
  Box,
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar
} from '@mui/material';
import AccountOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { GradientButton, ThemeChangeButton } from '@/components';
import { getUserInitials } from '@/utils';
import LinkText from './LinkText';

const links = [
  { href: '/about', text: 'Concerts' },
  { href: '/contact', text: 'Sports' },
  { href: '/theatre', text: 'Theatre' },
  { href: '/comedy', text: 'Comedy' },
];

/* Intrinsic SVG dimensions (logo.svg / logo-dark.svg viewBox) - real aspect ratio ~4.03:1. */
const logoWidth = 290;
const logoHeight = 72;

export default function AppBar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const openUserMenu = (event: MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
  const closeUserMenu = () => setMenuAnchor(null);

  const navigateToMyAccount = () => {
    router.push('/my-account');
  };

  const handleLogout = () => {
    closeUserMenu();
    void signOut();
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      <MuiAppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Toolbar
          component="nav"
          sx={{
            minHeight: { xs: 64, md: 72 },
            gap: { xs: 2, md: 1.5, lg: 5 },
            px: { xs: 2, md: 2, lg: 4 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Link
              href="/"
              aria-label="BookMyTicket home"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 36, md: 44, lg: 54 },
                  aspectRatio: `${logoWidth} / ${logoHeight}`,
                  width: 'auto',
                  '.logo-light, .logo-dark': {
                    position: 'absolute',
                    inset: 0,
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                  },
                  '.logo-light': {
                    display: 'block',
                  },
                  '.logo-dark': {
                    display: 'none',
                  },
                  'html[data-mui-color-scheme="dark"] & .logo-light': {
                    display: 'none',
                  },
                  'html[data-mui-color-scheme="dark"] & .logo-dark': {
                    display: 'block',
                  },
                }}
              >
                <Image
                  className="logo-light"
                  src="/logo.svg"
                  alt="BookMyTicket"
                  width={logoWidth}
                  height={logoHeight}
                  priority
                  style={{
                    height: '100%',
                    width: '100%'
                  }}
                />
                <Image
                  className="logo-dark"
                  src="/logo-dark.svg"
                  alt="BookMyTicket"
                  aria-hidden
                  width={logoWidth}
                  height={logoHeight}
                  priority
                  style={{
                    height: '100%',
                    width: '100%'
                  }}
                />
              </Box>
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: { xs: 2, md: 1.5, lg: 4 },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            {links.map(link => (
              <LinkText
                key={link.href}
                href={link.href}
                text={link.text}
              />
            ))}
          </Box>
          <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: { xs: 1, md: 1, lg: 2 },
            }}
          >
            {status === 'loading' && <Avatar sx={{ visibility: 'hidden' }} />}
            {status === 'authenticated' && session.user && (
              <>
                <Avatar
                  onClick={openUserMenu}
                  sx={{
                    background: theme => theme.palette.gradients.brandPrimary,
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {getUserInitials(session.user.firstName, session.user.lastName)}
                </Avatar>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={closeUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={navigateToMyAccount}>
                    <ListItemIcon>
                      <AccountOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Account Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main' }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Sign out
                  </MenuItem>
                </Menu>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Button
                  component={Link}
                  href="/login"
                  variant="text"
                  sx={{
                    fontSize: { xs: 14, md: 16 },
                    fontWeight: 700,
                    px: { xs: 1, lg: 2 }
                  }}
                  color="primary"
                >
                  Log in
                </Button>
                <GradientButton
                  href="/signup"
                  sx={{
                    borderRadius: '12px',
                    height: { xs: 36, md: 40, lg: 45 },
                    px: { xs: 1.5, md: 2, lg: 3.75 },
                    fontSize: { xs: 14, md: 16 }
                  }}
                  LinkComponent={Link}
                >
                  Sign Up
                </GradientButton>
              </>
            )}
            <ThemeChangeButton />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}
