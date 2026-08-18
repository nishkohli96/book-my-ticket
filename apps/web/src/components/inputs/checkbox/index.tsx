'use client';

import { type FieldValues } from 'react-hook-form';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import RHFCheckbox, { type RHFCheckboxProps } from '@nish1896/rhf-mui-components/mui/checkbox';
import StyledErrorMsg from '../StyledErrorMsg';

type StyledRHFCheckboxProps<T extends FieldValues> = Omit<RHFCheckboxProps<T>, 'ref'>;

const boxIconSx = {
  width: 20,
  height: 20,
  borderRadius: '7px',
  flexShrink: 0,
};

const UncheckedIcon = (
  <Box
    sx={{
      ...boxIconSx,
      border: '2px solid',
      borderColor: 'var(--mui-palette-divider)',
    }}
  />
);

const CheckedIcon = (
  <Box
    sx={{
      ...boxIconSx,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'primary.main',
    }}
  >
    <CheckIcon sx={{ fontSize: 16, color: 'common.white' }} />
  </Box>
);

const StyledRHFCheckbox = <T extends FieldValues>(
  props: StyledRHFCheckboxProps<T>
) => {
  const { renderError, ...rest } = props;
  return (
    <RHFCheckbox
      renderError={error => (
        <StyledErrorMsg errorMessage={error?.message} />
      )}
      icon={UncheckedIcon}
      checkedIcon={CheckedIcon}
      sx={{ pl: 0 }}
      formControlLabelProps={{ sx: { ml: 0 } }}
      {...rest}
    />
  );
};

export default StyledRHFCheckbox;
