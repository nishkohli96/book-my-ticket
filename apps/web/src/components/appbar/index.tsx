'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AppBar as MuiAppBar, Avatar, Box, Button, Toolbar } from '@mui/material';
import { GradientButton, ThemeChangeButton } from '@/components';
import LinkText from './LinkText';

function getInitials(firstName?: string | null, lastName?: string | null): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

const links = [
  { href: '/about', text: 'Concerts' },
  { href: '/contact', text: 'Sports' },
  { href: '/theatre', text: 'Theatre' },
  { href: '/comedy', text: 'Comedy' },
];

/* Natural (lg+) logo size — shrunk responsively at md via sx below. */
const logoWidth = 270;
const logoHeight = 54;

export default function AppBar() {
  const { data: session } = useSession();

  return (
    <Box sx={{ flexGrow: 1 }}>
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
                  height: { xs: 36, md: 32, lg: logoHeight },
                  width: { xs: 180, md: 160, lg: logoWidth },
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
                  src="/logo-light.svg"
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
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, md: 1.5, lg: 4 },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            {links.map(link => (
              <LinkText key={link.href} href={link.href} text={link.text} />
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 1, lg: 2 },
              flexShrink: 0,
            }}
          >
            {session?.user
              ? (
                <Avatar
                  sx={{
                    background: theme => theme.palette.gradients.brandPrimary,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {getInitials(session.user.firstName, session.user.lastName)}
                </Avatar>
              )
              : (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    variant="text"
                    sx={{ fontWeight: 700, px: { md: 1, lg: 2 } }}
                    color="primary"
                  >
                    Log in
                  </Button>
                  <GradientButton
                    href="/signup"
                    sx={{ borderRadius: '12px', px: { md: 2, lg: 3.75 } }}
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
