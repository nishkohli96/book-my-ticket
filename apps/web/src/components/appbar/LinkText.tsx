'use client';

import Link from 'next/link';
import Typography from '@mui/material/Typography';

type LinkTextProps = {
  href: string;
  text: string;
};

export default function LinkText({ href, text }: LinkTextProps) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none'
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          color: theme => theme.palette.text.secondary,
          '&:hover': {
            color: 'primary.main'
          }
        }}
      >
        {text}
      </Typography>
    </Link>
  );
}
