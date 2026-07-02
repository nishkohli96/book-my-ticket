'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AppBar as MuiAppBar, Box, Button, Toolbar } from '@mui/material';
import { GradientButton, ThemeChangeButton } from '@/components';
import LinkText from './LinkText';

const links = [
  { href: '/about', text: 'Concerts' },
  { href: '/contact', text: 'Sports' },
  { href: '/theatre', text: 'Theatre' },
  { href: '/comedy', text: 'Comedy' },
];

const logoWidth = 270;
const logoHeight = 54;

export default function AppBar() {
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
            gap: { xs: 2, md: 5 },
            px: { xs: 2, md: 4 }
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
                  height: logoHeight,
                  width: logoWidth,
                  '.logo-light, .logo-dark': {
                    position: 'absolute',
                    inset: 0,
                    height: logoHeight,
                    width: logoWidth,
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
                    height: logoHeight,
                    width: logoWidth
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
                    height: logoHeight,
                    width: logoWidth
                  }}
                />
              </Box>
            </Link>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, md: 4 },
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
              gap: { xs: 1, md: 2 },
              flexShrink: 0,
            }}
          >
            <Button
              component={Link}
              href="/login"
              variant="text"
              sx={{ fontWeight: 700 }}
              color="primary"
            >
              Log in
            </Button>
            <GradientButton
              text="Sign Up"
              href="/signup"
              sx={{ borderRadius: '12px' }}
              LinkComponent={Link}
            />
            <ThemeChangeButton />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}
