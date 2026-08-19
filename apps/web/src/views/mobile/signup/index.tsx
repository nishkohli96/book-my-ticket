'use client';

import { Box } from '@mui/material';
import { AppLink, BackButton, SecondaryText } from '@/components';
import SignUpForm from '@/views/common/signup';

export default function SignUpPageMobile() {
  return (
    <Box sx={{ p: 3, pb: 5 }}>
      <BackButton sx={{ mb: 2 }} />
      <SignUpForm />
      <SecondaryText sx={{ textAlign: 'center', mt: 3 }}>
        Already have an account?
        {' '}
        <AppLink href="/login">Log in</AppLink>
      </SecondaryText>
    </Box>
  );
}
