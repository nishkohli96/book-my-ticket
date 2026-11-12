'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import SeatIcon from '@mui/icons-material/EventSeatOutlined';
import { EventStatus, type EventDetail } from '@book-my-ticket/common';
import { GradientButton, SecondaryText } from '@/components';
import { eventCategories } from '@/constants';
import { formatEventDate, formatMoney } from '@/utils/format';

export default function EventDetailView({ event }: { event: EventDetail }) {
  const category = eventCategories.find(item => item.value === event.category);
  const hasStarted = new Date(event.startDate) <= new Date();
  const canBook = event.status === EventStatus.ONSALE && !hasStarted && event.seatsAvailable > 0;

  let unavailableReason = '';
  if (hasStarted) {
    unavailableReason = 'This event has already started.';
  } else if (event.status !== EventStatus.ONSALE) {
    unavailableReason = `Tickets are not on sale (${event.status}).`;
  } else if (event.seatsAvailable === 0) {
    unavailableReason = 'Sold out.';
  }

  const facts = [
    { icon: <CalendarIcon />, text: formatEventDate(event.startDate, event.timezone) },
    {
      icon: <PlaceIcon />,
      text: [event.venueName, event.venueAddress, event.city].filter(Boolean).join(' · ')
    },
    { icon: <SeatIcon />, text: `${event.seatsAvailable} of ${event.seatCapacity} seats available` },
  ];

  return (
    <Grid container spacing={{ xs: 3, md: 5 }}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '16 / 9',
            borderRadius: '20px',
            overflow: 'hidden',
            background: theme => theme.palette.gradients.cardConcert,
          }}
        >
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
              style={{ objectFit: 'cover' }}
            />
          )}
        </Box>
        <Stack spacing={1.5} sx={{ mt: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 800 }}>
            About this event
          </Typography>
          <SecondaryText sx={{ fontSize: 16, whiteSpace: 'pre-line' }}>
            {event.description
              ?? `${event.name} at ${event.venueName}, ${event.city}. Pick your seats on the live map and get your tickets instantly.`}
          </SecondaryText>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: '20px',
            p: { xs: 2.5, md: 3.5 },
            position: { md: 'sticky' },
            top: { md: 24 },
          }}
        >
          <Stack spacing={2.5}>
            {category && (
              <Chip
                label={category.label}
                color="primary"
                size="small"
                sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
              />
            )}
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
              {event.name}
            </Typography>
            <Stack spacing={1.5}>
              {facts.map(fact => (
                <Stack
                  key={fact.text}
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'flex-start', color: 'text.secondary' }}
                >
                  {fact.icon}
                  <Typography sx={{ color: 'text.primary' }}>
                    {fact.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Stack
              direction="row"
              sx={{
                pt: 2.5,
                borderTop: 1,
                borderColor: 'divider',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <SecondaryText>
                Tickets
              </SecondaryText>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {`${formatMoney(event.priceMin, event.currency)} – ${formatMoney(event.priceMax, event.currency)}`}
              </Typography>
            </Stack>
            {canBook
              ? (
                <GradientButton
                  href={`/events/${event.slug}/seats`}
                  LinkComponent={Link}
                  fullWidth
                >
                  Select seats
                </GradientButton>
              )
              : (
                <Typography sx={{ color: 'error.main', fontWeight: 700 }}>
                  {unavailableReason}
                </Typography>
              )}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
