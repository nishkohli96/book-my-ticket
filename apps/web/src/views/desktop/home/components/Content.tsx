'use client';

import { Box, Stack, Typography } from '@mui/material';
import { SecondaryText, GradientButton, OutlinedButton } from '@/components';

export default function Content() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        px: { md: 8, lg: 12 },
        py: { md: 8, lg: 10 },
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
          gridTemplateColumns: { md: 'minmax(0, 0.92fr) minmax(360px, 1fr)' },
          alignItems: 'center',
          gap: { md: 8, lg: 12 },
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
              fontSize: { md: 56, lg: 68 },
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
          <Stack direction="row" spacing={2}>
            <GradientButton sx={{ px: 3.5 }}>
              Sign up free
            </GradientButton>
            <OutlinedButton sx={{ px: 3.5 }}>
              Browse events as guest
            </OutlinedButton>
          </Stack>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--mui-palette-text-disabled)',
              fontWeight: 600,
            }}
          >
            No account needed to explore — sign in only when you check out.
          </Typography>
        </Stack>
        <Box
          sx={{
            justifySelf: 'end',
            width: { md: 360, lg: 420 },
            borderRadius: 5,
            overflow: 'hidden',
            backgroundColor: 'var(--mui-palette-background-paper)',
            boxShadow: '0 28px 70px rgba(15, 23, 42, 0.18)',
            border: '1px solid var(--mui-palette-divider)',
          }}
        >
          <Box
            sx={{
              height: 190,
              background: theme => theme.palette.gradients.cardConcert,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'common.white',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                backgroundColor: 'rgba(15, 23, 42, 0.35)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Concert · Tonight
            </Box>
            <Typography sx={{ fontWeight: 800, opacity: 0.88 }}>
              EVENT ARTWORK
            </Typography>
          </Box>
          <Stack spacing={1.25} sx={{ p: 2.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--mui-palette-primary-main)',
                fontWeight: 800,
                letterSpacing: 0.6,
              }}
            >
              SAT · MAR 15 · 8:00 PM
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Midnight Echo — Arena Tour
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Barclays Center · Brooklyn
            </Typography>
            <Stack direction="row" spacing={0.75} sx={{ pt: 0.5 }}>
              {['#4ADE80', '#60A5FA', '#FBBF24', '#334155', '#DB2777'].map(color => (
                <Box
                  key={color}
                  sx={{
                    height: 8,
                    flex: 1,
                    borderRadius: 999,
                    backgroundColor: color,
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
