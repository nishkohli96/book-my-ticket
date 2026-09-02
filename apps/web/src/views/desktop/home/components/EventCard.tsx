import { Box, Stack, Typography } from '@mui/material';

export default function EventCard() {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        width: '100%',
        maxWidth: 420,
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
          {['#4ADE80', '#60A5FA', '#FBBF24', '#334155', '#DB2777'].map(
            color => (
              <Box
                key={color}
                sx={{
                  height: 8,
                  flex: 1,
                  borderRadius: 999,
                  backgroundColor: color,
                }}
              />
            )
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
