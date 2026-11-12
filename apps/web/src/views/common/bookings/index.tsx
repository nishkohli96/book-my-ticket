'use client';

import Link from 'next/link';
import {
  Chip,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { BookingStatus, type Booking } from '@book-my-ticket/common';
import { GradientButton, SecondaryText } from '@/components';
import { formatEventDate, formatMoney } from '@/utils/format';

export function BookingStatusChip({ status }: { status: BookingStatus }) {
  const isConfirmed = status === BookingStatus.CONFIRMED;
  return (
    <Chip
      label={isConfirmed ? 'Confirmed' : 'Cancelled'}
      color={isConfirmed ? 'success' : 'default'}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}

type BookingsViewProps = {
  /** Null when booking-service couldn't be reached. */
  bookings: Booking[] | null;
};

export default function BookingsView({ bookings }: BookingsViewProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
        My bookings
      </Typography>

      {!bookings && (
        <Typography color="error.main" sx={{ py: 6, textAlign: 'center' }}>
          We couldn&apos;t load your bookings right now. Please refresh in a moment.
        </Typography>
      )}

      {bookings?.length === 0 && (
        <Stack spacing={2} sx={{ alignItems: 'center', py: 8, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No bookings yet
          </Typography>
          <SecondaryText>
            Tickets you buy show up here, ready to scan at the gate.
          </SecondaryText>
          <GradientButton href="/events" LinkComponent={Link}>
            Browse events
          </GradientButton>
        </Stack>
      )}

      {bookings?.map(booking => (
        <Paper
          key={booking.id}
          component={Link}
          href={`/my-bookings/${booking.id}`}
          variant="outlined"
          sx={{
            display: 'block',
            borderRadius: '16px',
            p: { xs: 2, md: 3 },
            textDecoration: 'none',
            opacity: booking.status === BookingStatus.CANCELLED ? 0.7 : 1,
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                {formatEventDate(booking.event.startDate, booking.event.timezone)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {booking.event.name}
              </Typography>
              <SecondaryText>
                {`${booking.event.venueName}, ${booking.event.city}`}
              </SecondaryText>
            </Stack>
            <Stack
              direction={{ xs: 'row', sm: 'column' }}
              spacing={1}
              sx={{
                alignItems: { xs: 'center', sm: 'flex-end' },
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <BookingStatusChip status={booking.status} />
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                {`${booking.seats.length} ${booking.seats.length === 1 ? 'seat' : 'seats'} · ${formatMoney(booking.total, booking.currency)}`}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
