import type { Metadata } from 'next';
import { eventListQuerySchema, type EventList } from '@book-my-ticket/common';
import { PageShell } from '@/components';
import { eventsPageSize } from '@/constants';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';
import EventsView from '@/views/common/events';

export const metadata: Metadata = { title: 'Events' };

type EventsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  /* Unknown or malformed filters fall back to "no filter" rather than erroring the page. */
  const parsed = eventListQuerySchema.safeParse({ ...(await searchParams), limit: eventsPageSize });
  const { category, city, q, page } = parsed.success
    ? parsed.data
    : eventListQuerySchema.parse({});

  const query = new URLSearchParams({ page: String(page), limit: String(eventsPageSize) });
  Object.entries({ category, city, q }).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const [list, cities] = await Promise.all([
    callService<EventList>(`${apiServicesUrl.event}/events?${query}`),
    callService<string[]>(`${apiServicesUrl.event}/events/cities`),
  ]);

  return (
    <PageShell>
      <EventsView
        list={list.data}
        cities={cities.data ?? []}
        filters={{ category, city, q }}
      />
    </PageShell>
  );
}
