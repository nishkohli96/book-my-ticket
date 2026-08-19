'use client';

import { useRouter } from 'next/navigation';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNew';

type BackButtonProps = Omit<IconButtonProps, 'children'>;

export default function BackButton({
  onClick,
  sx: btnSx,
  ...btnProps
}: BackButtonProps) {
  const router = useRouter();
  return (
    <IconButton
      {...btnProps}
      onClick={onClick ?? (() => router.back())}
      aria-label="Go back"
      sx={[
        {
          width: 44,
          height: 44,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          color: 'var(--mui-palette-text-primary)',
        },
        ...(Array.isArray(btnSx) ? btnSx : [btnSx]).filter(Boolean),
      ]}
    >
      <ArrowBackIcon fontSize="small" />
    </IconButton>
  );
}
