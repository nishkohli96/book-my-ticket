'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { SecondaryText } from '@/components';
import type { ReactNode } from 'react';

type MobileAuthShellProps = {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
};

export default function MobileAuthShell({ title, subtitle, footer, children }: MobileAuthShellProps) {
  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #1D4ED8, #DB2777)',
          py: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          textAlign: 'center',
          color: 'common.white',
          px: 2,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <Image
            src="/icons/icon-transparent.svg"
            alt="icon-transparent"
            width={40}
            height={40}
          />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ p: 3, pb: 5 }}>
        {children}
        <SecondaryText sx={{ textAlign: 'center', mt: 3 }}>
          {footer}
        </SecondaryText>
      </Box>
    </>
  );
}
