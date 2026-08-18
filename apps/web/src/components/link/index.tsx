'use client';

import NextLink from 'next/link';
import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link';

type AppLinkProps = Omit<MuiLinkProps, 'component' | 'href'> & {
  href: string;
};

export default function AppLink({ href, ...rest }: AppLinkProps) {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      color="primary"
      underline="always"
      {...rest}
    />
  );
}
