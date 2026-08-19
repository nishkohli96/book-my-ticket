import { Fragment, type ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

type StyledErrorMsgProps = {
  errorMessage: ReactNode;
};

export default function StyledErrorMsg({ errorMessage }: StyledErrorMsgProps) {
  return (
    <Fragment>
      {errorMessage && (
        <Typography
          variant="body2"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <ErrorOutlinedIcon color="error" fontSize="small" />
          {errorMessage}
        </Typography>
      )}
    </Fragment>
  );
}
