'use client';

import { type FieldValues } from 'react-hook-form';
import RHFPasswordInput, { type RHFPasswordInputProps } from '@nish1896/rhf-mui-components/mui/password-input';
import StyledErrorMsg from '../StyledErrorMsg';

type StyledRHFPasswordInputProps<T extends FieldValues> = Omit<
  RHFPasswordInputProps<T>,
  'variant' | 'showLabelAboveFormField'
>;

const StyledRHFPasswordInput = <T extends FieldValues>(
  props: StyledRHFPasswordInputProps<T>
) => {
  const { renderError, ...rest } = props;
  return (
    <RHFPasswordInput
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

export default StyledRHFPasswordInput;
