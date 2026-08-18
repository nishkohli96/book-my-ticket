'use client';

import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GradientButton, SignInWithGoogleButton, StyledRHFTextField, StyledRHFPasswordInput } from '@/components';
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
      <SignInWithGoogleButton />
    </Stack>
  );
}
