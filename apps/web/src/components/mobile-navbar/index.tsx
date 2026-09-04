'use client';

import { Stack, Typography } from '@mui/material';
import { BackButton, SecondaryText } from '@/components';

type MobileNavbarProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showDivider?: boolean;
};

export default function MobileNavbar({
  title,
  subtitle,
  onBack,
  showDivider = false
}: MobileNavbarProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: 'center',
        ...(showDivider && {
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }),
      }}
    >
      <BackButton onClick={onBack} />
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography variant="h5" noWrap sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle && (
          <SecondaryText noWrap>
            {subtitle}
          </SecondaryText>
        )}
      </Stack>
    </Stack>
  );
}
