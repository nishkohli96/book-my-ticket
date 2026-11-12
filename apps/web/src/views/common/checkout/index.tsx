'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  Alert,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import {
  bookingRules,
  checkoutSchema,
  type Booking,
  type CheckoutFormData,
  type SeatHold
} from '@book-my-ticket/common';
import {
  GradientButton,
  OutlinedButton,
  SecondaryText,
  StyledRHFTextField
} from '@/components';
import { formatEventDate, formatMoney, formatSeat } from '@/utils/format';

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Seconds until the hold lapses. Null until mounted - the server can't know the viewer's clock. */
function useSecondsLeft(expiresAt: string): number | null {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setSecondsLeft(Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000)));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return secondsLeft;
}

export default function CheckoutView({ hold }: { hold: SeatHold }) {
  const router = useRouter();
  const secondsLeft = useSecondsLeft(hold.expiresAt);
  const isExpired = secondsLeft === 0;
  const seatMapUrl = `/events/${hold.event.slug}/seats`;
  const [isReleasing, setIsReleasing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: ''
    }
  });

  const pay = async (card: CheckoutFormData) => {
    const response = await fetch(`/api/booking/holds/${hold.id}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    const result = await response.json() as { message: string; data: Booking | null };
    if (!response.ok || !result.data) {
      toast.error(result.message);
      return;
    }
    /* replace: going "back" to a spent checkout page would only show an expired hold. */
    router.replace(`/my-bookings/${result.data.id}?confirmed=1`);
  };

  const releaseSeats = async () => {
    setIsReleasing(true);
    await fetch(`/api/booking/holds/${hold.id}`, { method: 'DELETE' }).catch(() => null);
    router.push(seatMapUrl);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
        Checkout
      </Typography>

      {isExpired
        ? (
          <Alert
            severity="error"
            sx={{ borderRadius: '12px' }}
            action={(
              <OutlinedButton
                href={seatMapUrl}
                LinkComponent={Link}
                sx={{ height: 36, px: 2 }}
              >
                Pick seats again
              </OutlinedButton>
            )}
          >
            Your hold ran out and the seats are back on sale.
          </Alert>
        )
        : (
          <Alert severity="warning" sx={{ borderRadius: '12px' }}>
            {'Your seats are held for '}
            <strong>
              {secondsLeft === null ? '--:--' : formatCountdown(secondsLeft)}
            </strong>
            . Complete payment before the timer runs out.
          </Alert>
        )}

      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ borderRadius: '20px', p: { xs: 2.5, md: 3.5 } }}>
            <Stack
              component="form"
              spacing={2.5}
              noValidate
              onSubmit={handleSubmit(pay)}
            >
              <Typography variant="h6" component="h2" sx={{ fontWeight: 800 }}>
                Payment
              </Typography>
              <Alert severity="info" sx={{ borderRadius: '12px' }}>
                {'Test mode: nothing is charged and no card is stored. Use any card number; '}
                <strong>
                  {bookingRules.declinedTestCard.replace(/(\d{4})(?=\d)/g, '$1 ')}
                </strong>
                {' simulates a declined card.'}
              </Alert>
              <StyledRHFTextField
                fieldName="cardholderName"
                control={control}
                label="Name on card"
                autoComplete="cc-name"
                required
              />
              <StyledRHFTextField
                fieldName="cardNumber"
                control={control}
                label="Card number"
                placeholder="4242 4242 4242 4242"
                autoComplete="cc-number"
                required
                slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              />
              <Grid container spacing={2}>
                <Grid size={6}>
                  <StyledRHFTextField
                    fieldName="expiry"
                    control={control}
                    label="Expiry (MM/YY)"
                    placeholder="12/30"
                    autoComplete="cc-exp"
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <StyledRHFTextField
                    fieldName="cvv"
                    control={control}
                    label="CVV"
                    placeholder="123"
                    autoComplete="cc-csc"
                    required
                    slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                  />
                </Grid>
              </Grid>
              <GradientButton
                type="submit"
                fullWidth
                loading={isSubmitting}
                disabled={isExpired || isReleasing}
              >
                {`Pay ${formatMoney(hold.total, hold.currency)}`}
              </GradientButton>
              <OutlinedButton
                type="button"
                fullWidth
                loading={isReleasing}
                disabled={isSubmitting}
                onClick={() => void releaseSeats()}
              >
                Cancel and release seats
              </OutlinedButton>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ borderRadius: '20px', p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 800 }}>
                  {hold.event.name}
                </Typography>
                <SecondaryText>
                  {formatEventDate(hold.event.startDate, hold.event.timezone)}
                </SecondaryText>
                <SecondaryText>
                  {`${hold.event.venueName}, ${hold.event.city}`}
                </SecondaryText>
              </Stack>
              <Stack spacing={1} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                {hold.seats.map(seat => (
                  <Stack key={seat.id} direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      {formatSeat(seat)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatMoney(seat.price, hold.currency)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Stack spacing={1} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                {[
                  { label: 'Subtotal', amount: hold.subtotal },
                  { label: 'Service fees', amount: hold.serviceFees },
                ].map(line => (
                  <Stack key={line.label} direction="row" sx={{ justifyContent: 'space-between' }}>
                    <SecondaryText>
                      {line.label}
                    </SecondaryText>
                    <Typography variant="body2">
                      {formatMoney(line.amount, hold.currency)}
                    </Typography>
                  </Stack>
                ))}
                <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 1 }}>
                  <Typography sx={{ fontWeight: 800 }}>
                    Total
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {formatMoney(hold.total, hold.currency)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
