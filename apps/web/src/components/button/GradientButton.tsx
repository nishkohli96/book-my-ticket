'use client';

import Button, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type GradientButtonProps = Omit<ButtonProps, 'variant'> & {
  loading?: boolean;
};

export default function GradientButton({
  children,
  loading = false,
  disabled,
  sx: btnSx,
  ...btnProps
}: GradientButtonProps) {
  return (
    <Button
      {...btnProps}
      disabled={disabled || loading}
      variant="contained"
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
      sx={[
        {
          background: theme => theme.palette.gradients.brandPrimary,
          borderRadius: '14px',
          color: 'white',
          height: 48,
          padding: '0 30px',
          fontWeight: 700,
        },
        ...(Array.isArray(btnSx) ? btnSx : [btnSx])
      ]}
    >
      {children}
    </Button>
  );
}
