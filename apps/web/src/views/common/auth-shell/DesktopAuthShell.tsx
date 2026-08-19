'use client';

import { Box, Stack, Typography } from '@mui/material';
import { SecondaryText } from '@/components';
import type { ReactNode } from 'react';

type DesktopAuthShellProps = {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
};

export default function DesktopAuthShell({
  title,
  subtitle,
  footer,
  children,
}: DesktopAuthShellProps) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { md: '7fr 5fr' },
        overflow: 'hidden',
        backgroundColor: 'var(--mui-palette-background-paper)',
        boxShadow: '0 28px 70px rgba(15, 23, 42, 0.18)',
      }}
    >
      <Stack
        spacing={2}
        sx={{
          p: 6,
          justifyContent: 'center',
          background: theme => theme.palette.gradients.brandPrimary,
          color: 'common.white',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.65 }}>
          {subtitle}
        </Typography>
      </Stack>
      <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
        <SecondaryText sx={{ textAlign: 'center', mt: 3 }}>
          {footer}
        </SecondaryText>
      </Box>
    </Box>
  );
}
