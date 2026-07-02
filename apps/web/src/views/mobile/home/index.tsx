'use client';

import { Box, Typography } from '@mui/material';
import { GradientButton, OutlinedButton } from '@/components';
import Banner from './Banner';

export default function HomePageMobile() {
  return (
    <>
      <Banner />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5">
          {`Find your seat.
			Book it before it's gone.
			`}
        </Typography>
        <Typography variant="body1">
          Concerts, sports, theater & comedy — pick seats on a live map and
          check out in seconds.
        </Typography>
				<GradientButton text="Sign up for free" fullWidth sx={{ mt: '30px', mb: '20px'}} />
				<OutlinedButton text="Browse events as guest" fullWidth  />
      </Box>
    </>
  );
}
