import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { EventStatus, type EventDetail, type Seat } from '@book-my-ticket/common';
import { PageShell } from '@/components';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';
import SeatPicker from '@/views/common/seat-picker';

export const metadata: Metadata = { title: 'Select seats' };

type SeatsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SeatsPage({ params }: SeatsPageProps) {
  const { slug } = await params;
  const { data: event, status } = await callService<EventDetail>(
    `${apiServicesUrl.event}/events/${encodeURIComponent(slug)}`
  );
  if (status === 404) {
    notFound();
  }
  if (!event) {
    throw new Error('Could not load this event.');
  }
  /* Nothing to pick: the detail page explains why (sold out, started, off sale). */
  if (event.status !== EventStatus.ONSALE || new Date(event.startDate) <= new Date()) {
    redirect(`/events/${event.slug}`);
  }

  const seats = await callService<Seat[]>(`${apiServicesUrl.event}/events/${event.id}/seats`);

  return (
    <PageShell>
      <SeatPicker event={event} initialSeats={seats.data ?? []} />
    </PageShell>
  );
}
