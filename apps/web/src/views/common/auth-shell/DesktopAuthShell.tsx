'use client';

import { Box, Stack, Typography } from '@mui/material';
import { AppBar, SecondaryText } from '@/components';
import type { ReactNode } from 'react';

type DesktopAuthShellProps = {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
};

export default function DesktopAuthShell({ title, subtitle, footer, children }: DesktopAuthShellProps) {
  return (
    <>
      <AppBar />
      <Box
        component="section"
        sx={{
          minHeight: 'calc(100vh - 72px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { md: 8, lg: 12 },
          py: { md: 8 },
          background: `
            radial-gradient(circle at 82% 18%, rgba(219, 39, 119, 0.14), transparent 34%),
            radial-gradient(circle at 58% 30%, rgba(29, 78, 216, 0.10), transparent 28%),
            var(--mui-palette-background-default)
          `,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 960,
            display: 'grid',
            gridTemplateColumns: { md: '1fr 1fr' },
            borderRadius: 5,
            overflow: 'hidden',
            backgroundColor: 'var(--mui-palette-background-paper)',
            boxShadow: '0 28px 70px rgba(15, 23, 42, 0.18)',
            border: '1px solid var(--mui-palette-divider)',
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
          <Box sx={{ p: 6 }}>
            {children}
            <SecondaryText sx={{ textAlign: 'center', mt: 3 }}>
              {footer}
            </SecondaryText>
          </Box>
        </Box>
      </Box>
    </>
  );
}
