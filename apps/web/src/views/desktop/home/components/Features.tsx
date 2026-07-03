import Image from 'next/image';
import { Grid, Box, Paper } from '@mui/material';
import { PrimaryText, DisabledText } from '@/components';

const features = [
  {
    title: 'Live seat maps',
    description: 'See exactly which seats are open, held, or sold — refreshed in real time as others book.',
    icon: '/icons/seat-map.svg',
    color: 'var(--mui-palette-primaryTint)'
  },
  {
    title: 'Held while you decide',
    description: 'Your seats are reserved against a countdown, so no one grabs them mid-checkout.',
    icon: '/icons/clock.svg',
    color: 'var(--mui-palette-warningTint)'
  },
  {
    title: 'Live seat maps',
    description: 'Instant QR tickets in My Bookings — scan at the gate, no printing, no waiting.',
    icon: '/icons/phone.svg',
    color: 'var(--mui-palette-secondaryTint)'
  }
];
const iconSize = 40;

export default function Features() {
  return (
    <Grid
      container
      spacing={{ md: 2, lg: 3 }}
      sx={{
        px: { md: 8, lg: 12 },
        py: { md: 8, lg: 10 }
      }}
    >
      {features.map((feature, index) => (
        <Grid key={index} size={4}>
          <Paper>
            <Box sx={{ backgroundColor: feature.color }}>
              <Image
                src={feature.icon}
                alt={feature.title}
                width={iconSize}
                height={iconSize}
              />
            </Box>
            <PrimaryText>
              {feature.title}
            </PrimaryText>
            <DisabledText>
              {feature.description}
            </DisabledText>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
