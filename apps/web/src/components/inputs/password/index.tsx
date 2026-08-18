'use client';

import { Fragment, type ReactNode } from 'react';
import { type FieldValues } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import RHFPasswordInput, { type RHFPasswordInputProps } from '@nish1896/rhf-mui-components/mui/password-input';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

type StyledRHFPasswordInputProps<T extends FieldValues> = Omit<
  RHFPasswordInputProps<T>,
  'variant' | 'showLabelAboveFormField'
>;

type StyledErrorMsgProps = {
  errorMessage: ReactNode;
};

const StyledErrorMsg = ({ errorMessage }: StyledErrorMsgProps) => {
  return (
    <Fragment>
      {Boolean(errorMessage) && (
        <Typography variant="body2">
          <PriorityHighIcon color="error" />
          {errorMessage}
        </Typography>
      )}
    </Fragment>
  );
};

const StyledRHFPasswordInput = <T extends FieldValues>(
  props: StyledRHFPasswordInputProps<T>
) => {
  const { renderError, ...rest } = props;
  return (
    <RHFPasswordInput
      renderError={error => (
        <StyledErrorMsg errorMessage={error?.message} />
      )}
      variant="standard"
      showLabelAboveFormField
      {...rest}
    />
  );
};

export default StyledRHFPasswordInput;
