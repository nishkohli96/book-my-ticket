'use client';

import NextLink from 'next/link';
import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link';

type AppLinkProps = Omit<MuiLinkProps, 'component' | 'href'> & {
  href: string;
};

export default function AppLink({ href, sx, ...rest }: AppLinkProps) {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      color="primary"
      sx={{
        ...sx,
        fontWeight: 600
      }}
      underline="hover"
      {...rest}
    />
  );
}
