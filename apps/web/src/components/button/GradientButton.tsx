'use client';

import Button, { type ButtonProps } from '@mui/material/Button';

type GradientButtonProps = Omit<ButtonProps, 'variant'>;

export default function GradientButton({
  children,
  sx: btnSx,
  ...btnProps
}: GradientButtonProps) {
  return (
    <Button
      {...btnProps}
      variant="contained"
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
