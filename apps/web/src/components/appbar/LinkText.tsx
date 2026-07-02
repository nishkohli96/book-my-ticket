'use client';

import Link from 'next/link';
import Typography from '@mui/material/Typography';

type LinkTextProps = {
  href: string;
  text: string;
};

export default function LinkText({ href, text }: LinkTextProps) {
  return (
    <Link href={href} passHref>
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{ fontWeight: 600 }}
      >
        {text}
      </Typography>
    </Link>
  );
}
