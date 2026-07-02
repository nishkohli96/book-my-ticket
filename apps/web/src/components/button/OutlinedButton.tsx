'use client';

/**
 * Why have I used css vars and not theme ??
 * -> When you switch theme, the DOM variable changes, and CSS like
 *  this updates automatically.
 *  But "color: theme.palette.text.primary" can resolve to a concrete
 *  value from the theme object at style generation time. It may not
 *  rerun or may still be based on the default color scheme,
 */

import { type ReactNode } from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';

type OutlinedButtonProps = ButtonProps & {
  text: ReactNode;
};

export default function OutlinedButton({
  text,
  sx: btnSx,
  ...btnProps
}: OutlinedButtonProps) {
  return (
    <Button
      {...btnProps}
      variant="outlined"
      sx={[
        {
          borderWidth: '2px',
          borderColor: 'var(--mui-palette-divider) !important',
          borderRadius: '14px',
          color: 'var(--mui-palette-text-primary)',
          fontWeight: 600,
          height: 48,
          padding: '0 30px',
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: 'var(--mui-palette-text-secondary)',
            backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.04)',
          },
        },
        ...(Array.isArray(btnSx) ? btnSx : [btnSx])
      ]}
    >
      {text}
    </Button>
  );
}
