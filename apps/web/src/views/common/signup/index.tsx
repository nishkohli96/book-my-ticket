'use client';

import { Grid, Link, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import RHFCheckbox from '@nish1896/rhf-mui-components/mui/checkbox';
import { GradientButton, SignInWithGoogleButton, StyledRHFTextField, StyledRHFPasswordInput } from '@/components';
import { signUpSchema, type SignUpFormValues } from './schema';

export default function SignUpForm() {
  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: joiResolver(signUpSchema)
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
  };

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledRHFTextField
            fieldName="firstName"
            control={control}
            label="First name"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledRHFTextField
            fieldName="lastName"
            control={control}
            label="Last name"
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFTextField
            fieldName="email"
            control={control}
            label="Email"
          />
        </Grid>
        <Grid size={12}>
          <StyledRHFPasswordInput
            fieldName="password"
            control={control}
            label="Password"
          />
        </Grid>
        <Grid size={12}>
          <RHFCheckbox
            fieldName="agreeTnC"
            control={control}
            label={(
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                I agree to the
                {' '}
                <Link href="/tnc">Terms</Link>
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
      <SignInWithGoogleButton />
    </Stack>
  );
}
