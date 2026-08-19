'use client';

import { Divider, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppLink,
  GradientButton,
  SecondaryText,
  SignInWithGoogleButton,
  StyledRHFTextField,
  StyledRHFPasswordInput,
  StyledRHFCheckbox
} from '@/components';
import { signUpSchema, type SignUpFormData } from './schema';

export default function SignUpForm() {
  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur'
  });

  const onSubmit = (data: SignUpFormData) => {
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledRHFTextField
            fieldName="firstName"
            control={control}
            label="First name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledRHFTextField
            fieldName="lastName"
            control={control}
            label="Last name"
            required
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFTextField
            fieldName="email"
            control={control}
            label="Email"
            required
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFPasswordInput
            fieldName="password"
            control={control}
            label="Password"
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
      <GradientButton type="submit" fullWidth>
        Create account
      </GradientButton>
    </Stack>
  );
}
