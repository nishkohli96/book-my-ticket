'use client';

import Image from 'next/image';
import { Box } from '@mui/material';
import { AppLink, BackButton, SecondaryText } from '@/components';
import LoginForm from '@/views/common/login';

export default function LoginPageMobile() {
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
      <LoginForm />
      <SecondaryText sx={{ textAlign: 'center', mt: 3 }}>
        Don&apos;t have an account?
        {' '}
        <AppLink href="/signup">Sign up free</AppLink>
      </SecondaryText>
    </Box>
  );
}
