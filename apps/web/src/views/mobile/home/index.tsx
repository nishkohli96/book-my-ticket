'use client';

import { Box, Typography } from '@mui/material';
import { GradientButton, OutlinedButton } from '@/components';
import Banner from './Banner';

export default function HomePageMobile() {
  return (
    <>
      <Banner />
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            lineHeight: 1.25,
            mb: 1.5
          }}
        >
          <Box component="span" sx={{ display: 'block', whiteSpace: 'nowrap' }}>
            Find your seat.
          </Box>
          <Box component="span" sx={{ display: 'block' }}>
            Book it before it&apos;s gone.
          </Box>
        </Typography>
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.65, color: theme => theme.palette.text.secondary }}
        >
          Concerts, sports, theater & comedy — pick seats on a live map and
          check out in seconds.
        </Typography>
        <GradientButton
          text="Sign up for free"
          fullWidth
          sx={{ mt: 4, mb: 2 }}
        />
        <OutlinedButton text="Browse events as guest" fullWidth />
      </Box>
    </>
  );
}
