'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Stack } from '@mui/material';
import { editProfileSchema, type EditProfileFormData } from '@book-my-ticket/common';
import { StyledRHFTextField, StyledRHFPhoneInput, GradientButton, OutlinedButton } from '@/components';

type EditProfileFormProps = {
  formId: string;
  defaultValues: EditProfileFormData;
  onSubmit: (data: EditProfileFormData) => void | Promise<void>;
};

export default function EditProfileForm({
  formId,
  defaultValues,
  onSubmit,
}: EditProfileFormProps) {
  const {
    control,
    formState: { dirtyFields, isSubmitting },
    reset,
    handleSubmit
  } = useForm<EditProfileFormData>({
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
      <Grid size={{ xs: 12, md: 6 }}>
        <StyledRHFPhoneInput
          fieldName="phoneNumber"
          control={control}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <StyledRHFTextField
          fieldName="email"
          control={control}
          required
        />
      </Grid>
      <Grid size={12}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            mt: 1.5,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <GradientButton
            type="submit"
            loading={isSubmitting}
            sx={{ height: 44, px: 3 }}
          >
            Save changes
          </GradientButton>
          <OutlinedButton
            type="button"
            onClick={() => reset(defaultValues)}
            disabled={!Object.keys(dirtyFields).length || isSubmitting}
            sx={{ height: 44, px: 3 }}
          >
            Cancel
          </OutlinedButton>
        </Stack>
      </Grid>
    </Grid>
  );
}
