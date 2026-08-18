'use client';

import { type FieldValues } from 'react-hook-form';
import RHFTextField, { type RHFTextFieldProps } from '@nish1896/rhf-mui-components/mui/textfield';
import StyledErrorMsg from '../StyledErrorMsg';

type StyledRHFTextFieldProps<T extends FieldValues> = Omit<
  RHFTextFieldProps<T>,
  'variant' | 'showLabelAboveFormField'
>;

const StyledRHFTextField = <T extends FieldValues>(
  props: StyledRHFTextFieldProps<T>
) => {
  const { renderError, ...rest } = props;
  return (
    <RHFTextField
      renderError={error => (
        <StyledErrorMsg errorMessage={error?.message} />
      )}
      variant="outlined"
      showLabelAboveFormField
      formLabelProps={{
        sx: {
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: 'text.secondary',
          mb: 0.75,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
        },
      }}
      {...rest}
    />
  );
};

export default StyledRHFTextField;
