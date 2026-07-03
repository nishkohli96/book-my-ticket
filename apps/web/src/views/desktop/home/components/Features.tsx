import Image from 'next/image';
import { Grid, Box, Paper } from '@mui/material';
import { PrimaryText, DisabledText } from '@/components';

const features = [
  {
    title: 'Live seat maps',
    description: 'See exactly which seats are open, held, or sold — refreshed in real time as others book.',
    icon: '/icons/seat-map.svg',
    bgColor: 'var(--mui-palette-primaryTint)'
  },
  {
    title: 'Held while you decide',
    description: 'Your seats are reserved against a countdown, so no one grabs them mid-checkout.',
    icon: '/icons/clock.svg',
    bgColor: 'var(--mui-palette-warningTint)'
  },
  {
    title: 'Tickets on your phone',
    description: 'Instant QR tickets in My Bookings — scan at the gate, no printing, no waiting.',
    icon: '/icons/phone.svg',
    bgColor: 'var(--mui-palette-secondaryTint)'
  }
];
const iconSize = 22;

export default function Features() {
  return (
    <Grid
      container
      spacing={{ md: 2, lg: 3 }}
      sx={{
        px: { md: 8, lg: 12 },
        pb: { md: 8, lg: 10 },
        pt: { md: 2, lg: 3 },
        backgroundColor: 'var(--mui-palette-background-default)'
      }}
    >
      {features.map((feature, index) => (
        <Grid key={index} size={4}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              border: '1px solid var(--mui-palette-divider)',
              borderRadius: 4,
              backgroundColor: 'var(--mui-palette-background-paper)',
              p: 2.5,
              boxShadow: 'none'
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.25,
                borderRadius: 3,
                backgroundColor: feature.bgColor
              }}
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={iconSize}
                height={iconSize}
              />
            </Box>
            <PrimaryText
              sx={{
                mb: 0.75,
                fontWeight: 800,
                fontSize: 16,
                lineHeight: 1.25
              }}
            >
              {feature.title}
            </PrimaryText>
            <DisabledText
              sx={{
                maxWidth: 320,
                fontSize: 14,
                lineHeight: 1.55
              }}
            >
              {feature.description}
            </DisabledText>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
