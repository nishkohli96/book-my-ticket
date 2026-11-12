'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import {
  bookingRules,
  SeatStatus,
  type EventDetail,
  type Seat,
  type SeatHold
} from '@book-my-ticket/common';
import { AppLink, GradientButton, SecondaryText } from '@/components';
import { queryParamNames } from '@/constants';
import { formatEventDate, formatMoney, formatSeat } from '@/utils/format';

/** How often the map re-checks which seats other people have taken. */
const REFRESH_INTERVAL_MS = 5000;

type SeatPickerProps = {
  event: EventDetail;
  initialSeats: Seat[];
};

type SeatLook = 'available' | 'selected' | 'held' | 'booked';

const seatStyles: Record<SeatLook, object> = {
  available: {
    border: '1.5px solid var(--mui-palette-primary-main)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': { backgroundColor: 'var(--mui-palette-primaryTint)' },
  },
  selected: {
    border: '1.5px solid var(--mui-palette-primary-main)',
    backgroundColor: 'var(--mui-palette-primary-main)',
    cursor: 'pointer',
  },
  held: {
    border: '1.5px solid var(--mui-palette-warning-main)',
    backgroundColor: 'var(--mui-palette-warningTint)',
    cursor: 'not-allowed',
  },
  booked: {
    border: '1.5px solid transparent',
    backgroundColor: 'var(--mui-palette-action-disabledBackground)',
    cursor: 'not-allowed',
  },
};

const legend: { look: SeatLook; label: string }[] = [
  { look: 'available', label: 'Available' },
  { look: 'selected', label: 'Your pick' },
  { look: 'held', label: 'Held by someone' },
  { look: 'booked', label: 'Sold' },
];

function SeatSwatch({ look }: { look: SeatLook }) {
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: '5px',
        flexShrink: 0,
        ...seatStyles[look],
        cursor: 'default',
      }}
    />
  );
}

export default function SeatPicker({ event, initialSeats }: SeatPickerProps) {
  const router = useRouter();
  const { status } = useSession();
  const [seats, setSeats] = useState(initialSeats);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      const response = await fetch(`/api/event/events/${event.id}/seats`).catch(() => null);
      if (!response?.ok) {
        return;
      }
      const { data } = await response.json() as { data: Seat[] };
      setSeats(data);
    };
    const timer = setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [event.id]);

  /** Sections front to back, each with its rows in order. */
  const sections = useMemo(() => {
    const grouped = new Map<string, Map<string, Seat[]>>();
    seats.forEach(seat => {
      const rows = grouped.get(seat.section) ?? new Map<string, Seat[]>();
      rows.set(seat.row, [...(rows.get(seat.row) ?? []), seat]);
      grouped.set(seat.section, rows);
    });
    return [...grouped.entries()].map(([name, rows]) => ({
      name,
      price: [...rows.values()][0][0].price,
      rows: [...rows.entries()],
    }));
  }, [seats]);

  /*
   * Derived on every refresh: a picked seat that someone else just took
   * drops out of the selection on its own, with no state to keep in sync.
   */
  const selectedSeats = seats.filter(
    seat => selectedIds.includes(seat.id) && seat.status === SeatStatus.AVAILABLE
  );
  const selectedSeatIds = new Set(selectedSeats.map(seat => seat.id));
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const atLimit = selectedSeats.length >= bookingRules.maxSeatsPerBooking;

  const toggleSeat = (seat: Seat) => {
    if (selectedSeatIds.has(seat.id)) {
      setSelectedIds([...selectedSeatIds].filter(id => id !== seat.id));
    } else if (atLimit) {
      toast.info(`You can book up to ${bookingRules.maxSeatsPerBooking} seats at a time.`);
    } else {
      setSelectedIds([...selectedSeatIds, seat.id]);
    }
  };

  const holdSeats = async () => {
    if (status !== 'authenticated') {
      const loginParams = new URLSearchParams({
        [queryParamNames.callbackUrl]: `/events/${event.slug}/seats`
      });
      router.push(`/login?${loginParams}`);
      return;
    }

    setIsHolding(true);
    const response = await fetch('/api/booking/holds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event.id, seatIds: [...selectedSeatIds] }),
    });
    const result = await response.json() as { message: string; data: SeatHold | null };
    if (!response.ok || !result.data) {
      toast.error(result.message);
      setSelectedIds([]);
      setIsHolding(false);
      return;
    }
    router.push(`/checkout/${result.data.id}`);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <AppLink href={`/events/${event.slug}`} variant="body2">
          ← Back to event
        </AppLink>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          {event.name}
        </Typography>
        <SecondaryText>
          {`${formatEventDate(event.startDate, event.timezone)} · ${event.venueName}, ${event.city}`}
        </SecondaryText>
      </Stack>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper variant="outlined" sx={{ borderRadius: '20px', p: { xs: 2, md: 3 } }}>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 1, mb: 3 }}>
              {legend.map(item => (
                <Stack key={item.look} direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                  <SeatSwatch look={item.look} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Wider than a phone screen, so the map scrolls sideways rather than shrinking seats below a tappable size. */}
            <Box sx={{ overflowX: 'auto', pb: 1 }}>
              <Stack spacing={3} sx={{ width: 'max-content', minWidth: '100%', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '70%',
                    minWidth: 240,
                    py: 0.75,
                    borderRadius: '0 0 40px 40px',
                    textAlign: 'center',
                    color: 'common.white',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 2,
                    background: theme => theme.palette.gradients.stageBar,
                  }}
                >
                  STAGE
                </Box>
                {sections.map(section => (
                  <Stack key={section.name} spacing={0.75} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 0.6 }}>
                      {`${section.name.toUpperCase()} · ${formatMoney(section.price, event.currency)}`}
                    </Typography>
                    {section.rows.map(([row, rowSeats]) => (
                      <Stack key={row} direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          sx={{ width: 16, color: 'text.secondary', fontWeight: 700 }}
                        >
                          {row}
                        </Typography>
                        {rowSeats.map(seat => {
                          const isSelected = selectedSeatIds.has(seat.id);
                          const look: SeatLook = isSelected ? 'selected' : seat.status;
                          return (
                            <Box
                              key={seat.id}
                              component="button"
                              type="button"
                              disabled={seat.status !== SeatStatus.AVAILABLE}
                              aria-pressed={isSelected}
                              aria-label={`${formatSeat(seat)}, ${look}`}
                              title={formatSeat(seat)}
                              onClick={() => toggleSeat(seat)}
                              sx={{
                                width: 24,
                                height: 24,
                                p: 0,
                                borderRadius: '6px',
                                ...seatStyles[look],
                              }}
                            />
                          );
                        })}
                      </Stack>
                    ))}
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: '20px',
              p: 3,
              position: { md: 'sticky' },
              top: { md: 24 },
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 800 }}>
                Your seats
              </Typography>
              {selectedSeats.length === 0
                ? (
                  <SecondaryText>
                    {`Tap seats on the map to pick up to ${bookingRules.maxSeatsPerBooking}.`}
                  </SecondaryText>
                )
                : selectedSeats.map(seat => (
                  <Stack key={seat.id} direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      {formatSeat(seat)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatMoney(seat.price, event.currency)}
                    </Typography>
                  </Stack>
                ))}
              <Stack
                direction="row"
                sx={{
                  pt: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  Subtotal
                </Typography>
                <Typography sx={{ fontWeight: 800 }}>
                  {formatMoney(subtotal, event.currency)}
                </Typography>
              </Stack>
              <GradientButton
                fullWidth
                disabled={selectedSeats.length === 0}
                loading={isHolding}
                onClick={() => void holdSeats()}
              >
                {status === 'authenticated' ? 'Hold seats & check out' : 'Log in to continue'}
              </GradientButton>
              <SecondaryText sx={{ fontSize: 13 }}>
                {`Seats are held for ${bookingRules.holdDurationSeconds / 60} minutes while you pay. Fees are added at checkout.`}
              </SecondaryText>
              {status === 'unauthenticated' && (
                <SecondaryText sx={{ fontSize: 13 }}>
                  New here?
                  {' '}
                  <Link href="/signup">Create an account</Link>
                </SecondaryText>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
