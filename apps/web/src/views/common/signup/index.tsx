'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Divider, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  AppLink,
  GradientButton,
  SecondaryText,
  SignInWithGoogleButton,
  StyledRHFTextField,
  StyledRHFPasswordInput,
  StyledRHFPhoneInput,
  StyledRHFCheckbox
} from '@/components';
import { signUpSchema, type SignUpFormData } from './schema';

export default function SignUpForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: SignUpFormData) => {
    setSubmitError(null);

    const response = await fetch('/api/users/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      setSubmitError(result.message ?? 'Something went wrong. Please try again.');
      toast.error(result.message ?? 'Something went wrong. Please try again.')
      return;
    }
    router.push('/login');
  };

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Create your account
        </Typography>
        <SecondaryText>
          It only takes a minute
        </SecondaryText>
      </Stack>

      <SignInWithGoogleButton fullWidth>
        Continue with Google
      </SignInWithGoogleButton>

      <Divider sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 700 }}>
        OR
      </Divider>

      {submitError && (
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          {submitError}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledRHFTextField
            fieldName="firstName"
            control={control}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledRHFTextField
            fieldName="lastName"
            control={control}
            required
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFPhoneInput
            fieldName="phoneNumber"
            control={control}
            required
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFTextField
            fieldName="email"
            control={control}
            required
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFPasswordInput
            fieldName="password"
            control={control}
            required
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFCheckbox
            fieldName="agreeTnC"
            control={control}
            label={(
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                I agree to the
                {' '}
                <AppLink href="/tnc">Terms</AppLink>
                {' '}
                and Privacy Policy
              </Typography>
            )}
          />
        </Grid>
      </Grid>
      <GradientButton
        type="submit"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </GradientButton>
    </Stack>
  );
}
