'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export default function Banner() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #1D4ED8, #DB2777)',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        textAlign: 'center',
        color: 'common.white',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.22)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <Image
          src="/icons/icon-transparent.svg"
          alt="icon-transparent"
          width={48}
          height={48}
        />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
        BookMyTicket
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9 }}>
        Live events, real time seats
      </Typography>
    </Box>
  );
}
