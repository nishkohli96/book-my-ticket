'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { BookingStatus, type Booking } from '@book-my-ticket/common';
import {
  AppLink,
  GradientButton,
  OutlinedButton,
  SecondaryText
} from '@/components';
import { formatEventDate, formatMoney, formatSeat } from '@/utils/format';
import { BookingStatusChip } from './index';

type TicketProps = {
  booking: Booking;
  /** QR image (data URL) encoding the booking code. */
  qrCode: string;
  /** True right after checkout, to show the success banner once. */
  justConfirmed: boolean;
};

export default function Ticket({ booking, qrCode, justConfirmed }: TicketProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isConfirmed = booking.status === BookingStatus.CONFIRMED;
  const canCancel = isConfirmed && new Date(booking.event.startDate) > new Date();

  const cancelBooking = async () => {
    setIsCancelling(true);
    const response = await fetch(`/api/booking/bookings/${booking.id}/cancel`, { method: 'POST' });
    const result = await response.json() as { message: string };
    setIsCancelling(false);
    setIsDialogOpen(false);
    if (!response.ok) {
      toast.error(result.message);
      return;
    }
    toast.success('Booking cancelled');
    /* Re-run the server component so the page shows the cancelled booking. */
    router.refresh();
  };

  return (
    <Stack spacing={3}>
      <AppLink href="/my-bookings" variant="body2">
        ← All bookings
      </AppLink>

      {justConfirmed && isConfirmed && (
        <Alert severity="success" sx={{ borderRadius: '12px' }}>
          You&apos;re going! Your tickets are below.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ borderRadius: '20px', overflow: 'hidden' }}>
        <Box
          sx={{
            p: { xs: 2.5, md: 3.5 },
            color: 'common.white',
            background: theme => theme.palette.gradients.brandPrimary,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.9 }}
          >
            {formatEventDate(booking.event.startDate, booking.event.timezone)}
          </Typography>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mt: 0.5 }}>
            {booking.event.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
            {`${booking.event.venueName}, ${booking.event.city}`}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ p: { xs: 2.5, md: 3.5 }, alignItems: { xs: 'center', sm: 'flex-start' } }}
        >
          {isConfirmed && (
            <Stack spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
              {/* Plain <img>: a data URL has nothing for next/image to optimize. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCode}
                alt={`QR code for booking ${booking.bookingCode}`}
                width={180}
                height={180}
                style={{ borderRadius: 12, background: '#fff', padding: 8 }}
              />
              <SecondaryText sx={{ fontSize: 13 }}>
                Scan at the gate
              </SecondaryText>
            </Stack>
          )}

          <Stack spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack>
                <SecondaryText sx={{ fontSize: 13 }}>
                  Booking code
                </SecondaryText>
                <Typography sx={{ fontWeight: 800, letterSpacing: 1 }}>
                  {booking.bookingCode}
                </Typography>
              </Stack>
              <BookingStatusChip status={booking.status} />
            </Stack>

            <Stack spacing={1} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              {booking.seats.map(seat => (
                <Stack key={seat.id} direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {formatSeat(seat)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatMoney(seat.price, booking.currency)}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack spacing={1} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <SecondaryText>
                  Service fees
                </SecondaryText>
                <Typography variant="body2">
                  {formatMoney(booking.serviceFees, booking.currency)}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 800 }}>
                  Total paid
                </Typography>
                <Typography sx={{ fontWeight: 800 }}>
                  {formatMoney(booking.total, booking.currency)}
                </Typography>
              </Stack>
            </Stack>

            {canCancel && (
              <OutlinedButton
                onClick={() => setIsDialogOpen(true)}
                sx={{
                  alignSelf: { sm: 'flex-start' },
                  height: 44,
                  px: 3,
                  color: 'error.main',
                  borderColor: 'var(--mui-palette-error-main) !important',
                }}
              >
                Cancel booking
              </OutlinedButton>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Cancel this booking?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your seats go back on sale straight away and this ticket stops working. This can&apos;t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <OutlinedButton
            onClick={() => setIsDialogOpen(false)}
            disabled={isCancelling}
            sx={{ height: 44, px: 3 }}
          >
            Keep booking
          </OutlinedButton>
          <GradientButton
            onClick={() => void cancelBooking()}
            loading={isCancelling}
            sx={{ height: 44, px: 3 }}
          >
            Cancel booking
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
