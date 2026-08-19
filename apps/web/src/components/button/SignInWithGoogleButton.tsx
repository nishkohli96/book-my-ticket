'use client';

import { type MouseEvent } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import Button, { type ButtonProps } from '@mui/material/Button';

type SignInWithGoogleButtonProps = Omit<ButtonProps, 'variant' | 'startIcon'>;

export default function SignInWithGoogleButton({
  children = 'Sign in with Google',
  onClick,
  sx: btnSx,
  ...btnProps
}: SignInWithGoogleButtonProps) {

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
      return;
    }
    void signIn('google');
  };

  return (
    <Button
      {...btnProps}
      variant="outlined"
      onClick={handleClick}
      startIcon={
        <Image
          src="/icons/google.svg"
          alt=""
          aria-hidden
          width={20}
          height={20}
        />
      }
      sx={[
        {
          height: 48,
          px: 3,
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: 'var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          color: 'var(--mui-palette-text-primary)',
          fontWeight: 700,
          textTransform: 'none',
          '&:hover': {
            borderColor: 'var(--mui-palette-text-secondary)',
            backgroundColor:
              'rgba(var(--mui-palette-primary-mainChannel) / 0.04)',
          },
          '& .MuiButton-startIcon': {
            mr: 1.25,
            ml: 0,
          },
        },
        ...(Array.isArray(btnSx) ? btnSx : [btnSx]).filter(Boolean),
      ]}
    >
      {children}
    </Button>
  );
}
