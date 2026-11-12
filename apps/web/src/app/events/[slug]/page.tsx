import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { EventDetail } from '@book-my-ticket/common';
import { PageShell } from '@/components';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';
import EventDetailView from '@/views/common/event-detail';

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

/** Deduped per request: generateMetadata and the page both need the event. */
const getEvent = cache((slug: string) =>
  callService<EventDetail>(`${apiServicesUrl.event}/events/${encodeURIComponent(slug)}`));

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { data } = await getEvent((await params).slug);
  return { title: data?.name ?? 'Event' };
}

export default async function EventPage({ params }: EventPageProps) {
  const { data: event, status } = await getEvent((await params).slug);
  if (status === 404) {
    notFound();
  }
  if (!event) {
    throw new Error('Could not load this event.');
  }

  return (
    <PageShell>
      <EventDetailView event={event} />
    </PageShell>
  );
}
