'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import { editProfileSchema, type EditProfileFormData } from '@book-my-ticket/common';
import { StyledRHFTextField, StyledRHFPhoneInput } from '@/components';

type EditProfileFormProps = {
  formId: string;
  defaultValues: EditProfileFormData;
  onSubmit: (data: EditProfileFormData) => void | Promise<void>;
  fieldColumnSize?: { xs: number; md?: number };
};

export default function EditProfileForm({
  formId,
  defaultValues,
  onSubmit,
  fieldColumnSize = { xs: 12, md: 6 }
}: EditProfileFormProps) {
  const { control, handleSubmit } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onBlur',
    defaultValues
  });

  return (
    <Grid
      component="form"
      id={formId}
      container
      spacing={2.5}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid size={fieldColumnSize}>
        <StyledRHFTextField
          fieldName="firstName"
          control={control}
          required
        />
      </Grid>
      <Grid size={fieldColumnSize}>
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
    </Grid>
  );
}
