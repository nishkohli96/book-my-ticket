'use client';

import { Box, Grid, Typography } from '@mui/material';
import { Body1, GradientButton, OutlinedButton } from '@/components';

export default function HomePageContent() {
  return (
    <Grid container spacing={2} sx={{ padding: '20px' }}>
      <Grid container size={{ md: 6, lg: 5 }}>
        <Grid>
          <Typography>
            <Typography component="span" color="success" style={{ width: 20, height: 20, borderRadius: '50%' }} />
            <Typography component="span">
              Live seat availability, updated by second
            </Typography>
          </Typography>
        </Grid>
        <Grid>
          <Typography
            variant="h2"
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
              Book it before it&apos;s
              <Typography sx={{ color: theme => theme.palette.gradients.hero }}>gone.</Typography>
            </Box>
          </Typography>
        </Grid>
        <Grid>
          <Body1>
            Concerts, sports, theatre and comedy - pick your seats on a
            live map, hold them against a countdown, and get tickets
            to your phone in seconds.
          </Body1>
        </Grid>
        <Grid>
					<GradientButton
										>
											Sign up for free
									</GradientButton>
									<OutlinedButton>
										Browse events as guest
									</OutlinedButton>
					</Grid>
        <Grid />
      </Grid>
      <Grid size={{ md: 6, lg: 7 }} />
    </Grid>
  );
}
