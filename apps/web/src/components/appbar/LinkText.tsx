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
        color="textSecondary"
        sx={{
          fontWeight: 600,
          lineHeight: 1,
          whiteSpace: 'nowrap',
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
