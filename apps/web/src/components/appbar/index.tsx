'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AppBar as MuiAppBar, Box, Toolbar, Typography } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { GradientButton, ThemeChangeButton } from '@/components';
import LinkText from './LinkText';

const links = [
  { href: '/about', text: 'Concerts' },
  { href: '/contact', text: 'Sports' },
  { href: '/theatre', text: 'Theatre' },
  { href: '/comedy', text: 'Comedy' },
];

export default function AppBar() {
  const { mode } = useColorScheme();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position="static">
        <Toolbar>
            <Box sx={{ display: 'flex'}}>
          <Link href="/" style={{ marginRight: '10px' }}>
              <Image
                src={mode === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
                alt="Logo"
                fill
              />
          </Link>
            </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexGrow: 1,
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
              gap: 2,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 700 }}
              color="primary"
            >
              Log in
            </Typography>
            <GradientButton text="Sign Up" />
          </Box>
          {/* <ThemeChangeButton /> */}
          {/* </Box> */}
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}
