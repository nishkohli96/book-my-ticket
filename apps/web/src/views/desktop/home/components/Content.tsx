'use client';

import Image from 'next/image';
import { Box, Stack, Typography } from '@mui/material';
import { SecondaryText, GradientButton, OutlinedButton } from '@/components';
import EventCard from './EventCard';

export default function Content() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        px: { xs: 4, md: 4, lg: 12 },
        py: { xs: 4, md: 6, lg: 10 },
        background: `
          radial-gradient(circle at 82% 18%, rgba(219, 39, 119, 0.14), transparent 34%),
          radial-gradient(circle at 58% 30%, rgba(29, 78, 216, 0.10), transparent 28%),
          var(--mui-palette-background-default)
        `,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { lg: 'minmax(0, 0.92fr) minmax(360px, 1fr)' },
          alignItems: 'center',
          justifyItems: { md: 'center', lg: 'stretch' },
          gap: { md: 6, lg: 12 },
        }}
      >
        <Stack spacing={3} sx={{ maxWidth: 560 }}>
          <Box
            sx={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.10)',
              color: 'var(--mui-palette-primary-main)',
              fontWeight: 800,
              fontSize: 12,
              borderRadius: 2,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: 'var(--mui-palette-success-main)',
              }}
            />
            Live seat availability, updated by the second
          </Box>
          <Typography
            variant="h1"
            sx={{
              maxWidth: 560,
              color: 'var(--mui-palette-text-primary)',
              fontSize: { xs: 40, sm: 48, md: 56, lg: 68 },
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: 0,
            }}
          >
            <Box component="span" sx={{ display: 'block', whiteSpace: 'nowrap' }}>
              Find your seat.
            </Box>
            <Box component="span" sx={{ display: 'block' }}>
              Book it before
            </Box>
            <Box component="span" sx={{ display: 'block' }}>
              it&apos;s
              {' '}
              <Box
                component="span"
                sx={{
                  background: theme => theme.palette.gradients.brandPrimary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                gone.
              </Box>
            </Box>
          </Typography>
          <SecondaryText sx={{ maxWidth: 500, fontSize: 18 }}>
            Concerts, sports, theater and comedy — pick seats on a live map,
            hold them against a countdown, and get tickets to your phone in
            seconds.
          </SecondaryText>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
          >
            <GradientButton
              sx={{ px: 3.5 }}
              endIcon={(
                <Image
                  src="/icons/right-arrow.svg"
                  alt=""
                  aria-hidden
                  width={18}
                  height={18}
                />
              )}
            >
              Sign up free
            </GradientButton>
            <OutlinedButton sx={{ px: 3.5 }}>
              Browse events as guest
            </OutlinedButton>
          </Stack>
        </Stack>
        <EventCard />
      </Box>
    </Box>
  );
}
