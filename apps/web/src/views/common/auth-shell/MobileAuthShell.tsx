'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import { BackButton, SecondaryText } from '@/components';
import type { ReactNode } from 'react';

type MobileAuthShellProps = {
  footer: ReactNode;
  children: ReactNode;
};

export default function MobileAuthShell({ footer, children }: MobileAuthShellProps) {
  return (
    <Box sx={{ p: 3, pb: 5 }}>
      <BackButton sx={{ mb: 2 }} />
      <Box
        sx={{
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          borderRadius: 3,
          background: theme => theme.palette.gradients.brandPrimary,
        }}
      >
        <Image
          src="/icons/icon-transparent.svg"
          alt="icon-transparent"
          width={32}
          height={32}
        />
      </Box>
      {children}
      <SecondaryText sx={{ textAlign: 'center', mt: 3 }}>
        {footer}
      </SecondaryText>
    </Box>
  );
}
