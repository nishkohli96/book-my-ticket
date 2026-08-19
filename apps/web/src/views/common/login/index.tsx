'use client';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@book-my-ticket/common';
import {
  AppLink,
  GradientButton,
  SecondaryText,
  SignInWithGoogleButton,
  StyledRHFTextField,
  StyledRHFPasswordInput
} from '@/components';

export default function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Welcome back
        </Typography>
        <SecondaryText>
          Log in to continue to your account
        </SecondaryText>
      </Stack>

      <SignInWithGoogleButton fullWidth>
        Continue with Google
      </SignInWithGoogleButton>

      <Divider sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 700 }}>
        OR
      </Divider>

      <StyledRHFTextField
        fieldName="email"
        control={control}
        label="Email"
        required
      />
      <StyledRHFPasswordInput
        fieldName="password"
        control={control}
        label="Password"
        required
      />
      <Box sx={{ textAlign: 'right', mt: -1.5 }}>
        <AppLink href="/forgot-password" variant="body2">
          Forgot password?
        </AppLink>
      </Box>
      <GradientButton type="submit" fullWidth>
        Log in
      </GradientButton>
    </Stack>
  );
}
