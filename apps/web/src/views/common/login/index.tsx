'use client';

import { Divider, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GradientButton, SecondaryText, SignInWithGoogleButton, StyledRHFTextField, StyledRHFPasswordInput } from '@/components';
import { loginSchema, type LoginFormValues } from './schema';

export default function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
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
          Log in to manage your bookings
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
      />
      <StyledRHFPasswordInput
        fieldName="password"
        control={control}
        label="Password"
      />
      <GradientButton type="submit" fullWidth>
        Log in
      </GradientButton>
    </Stack>
  );
}
