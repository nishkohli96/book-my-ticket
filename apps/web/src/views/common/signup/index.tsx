'use client';

import { Grid, Link, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import RHFTextField from '@nish1896/rhf-mui-components/mui/textfield';
import RHFPasswordInput from '@nish1896/rhf-mui-components/mui/password-input';
import RHFCheckbox from '@nish1896/rhf-mui-components/mui/checkbox';
import { SignInWithGoogleButton } from '@/components';

export default function SignUpForm() {
  const { control, handleSubmit } = useForm();
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <RHFTextField
          fieldName="firstName"
          control={control}
          label={'firstName'.toUpperCase()}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <RHFTextField
          fieldName="lastName"
          control={control}
          label={'lastName'.toUpperCase()}
        />
      </Grid>
      <Grid size={12}>
        <RHFTextField
          fieldName="email"
          control={control}
          label={'email'.toUpperCase()}
        />
      </Grid>
      <Grid size={12}>
        <RHFPasswordInput
          fieldName="password"
          control={control}
          label={'password'.toUpperCase()}
        />
      </Grid>
      <Grid size={12}>
        <RHFCheckbox
          fieldName="agreeTnC"
          control={control}
          label={
            <Typography>
              I agree to the
              <Link href="/tnc">Terms</Link> and Privacy Policy
            </Typography>
          }
        />
      </Grid>
    </Grid>
  );
}
