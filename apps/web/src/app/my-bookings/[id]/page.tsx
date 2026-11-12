import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import type { Booking } from '@book-my-ticket/common';
import { PageShell } from '@/components';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';
import Ticket from '@/views/common/bookings/Ticket';

export const metadata: Metadata = { title: 'Your ticket' };

type BookingPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirmed?: string }>;
};

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { id } = await params;
  const { data: booking, status } = await callService<Booking>(
    `${apiServicesUrl.booking}/bookings/${encodeURIComponent(id)}`,
    { authenticated: true }
  );
  if (status === 404) {
    notFound();
  }
  if (!booking) {
    throw new Error('Could not load this booking.');
  }

  const qrCode = await QRCode.toDataURL(booking.bookingCode, { margin: 1, width: 360 });

  return (
    <PageShell maxWidth={880}>
      <Ticket
        booking={booking}
        qrCode={qrCode}
        justConfirmed={(await searchParams).confirmed === '1'}
      />
    </PageShell>
  );
}
