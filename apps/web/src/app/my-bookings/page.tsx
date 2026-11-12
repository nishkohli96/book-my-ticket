import type { Metadata } from 'next';
import type { Booking } from '@book-my-ticket/common';
import { PageShell } from '@/components';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';
import BookingsView from '@/views/common/bookings';

export const metadata: Metadata = { title: 'My bookings' };

/* Signed-out visitors never get here - proxy.ts redirects /my-bookings to /login. */
export default async function MyBookingsPage() {
  const { data } = await callService<Booking[]>(
    `${apiServicesUrl.booking}/bookings`,
    { authenticated: true }
  );

  return (
    <PageShell maxWidth={880}>
      <BookingsView bookings={data} />
    </PageShell>
  );
}
