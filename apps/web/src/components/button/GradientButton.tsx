'use client';

import Button, { type ButtonProps } from '@mui/material/Button';

type GradientButtonProps = ButtonProps & {
  text: string;
};

export default function GradientButton({
  text,
  sx: btnSx,
  ...btnProps
}: GradientButtonProps) {
  return (
    <Button
      variant="contained"
      sx={[
        {
          background: theme => theme.palette.gradients.brandPrimary,
          borderRadius: '14px',
          color: 'white',
          height: 48,
          padding: '0 30px',
					fontWeight: 600,
        },
        ...(Array.isArray(btnSx) ? btnSx : [btnSx])
      ]}
      {...btnProps}
    >
      {text}
    </Button>
  );
}
