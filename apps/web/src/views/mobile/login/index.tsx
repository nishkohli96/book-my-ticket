'use client';

import Image from 'next/image';
import { Box } from '@mui/material';
import { AppLink, BackButton, SecondaryText } from '@/components';
import LoginForm from '@/views/common/login';

export default function LoginPageMobile() {
  return (
    <Box sx={{ p: 3, pb: 5 }}>
      <BackButton sx={{ mb: 2 }} />
      <LoginForm />
      <SecondaryText sx={{ textAlign: 'center', mt: 3 }}>
        Don&apos;t have an account?
        {' '}
        <AppLink href="/signup">Sign up free</AppLink>
      </SecondaryText>
    </Box>
  );
}
