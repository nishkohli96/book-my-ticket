'use client';

import Form from 'next/form';
import Image from 'next/image';
import Link from 'next/link';
import {
  Chip,
  Grid,
  Pagination,
  PaginationItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import type { EventCategory, EventList } from '@book-my-ticket/common';
import { GradientButton, SecondaryText } from '@/components';
import { eventCategories } from '@/constants';
import EventCard from './EventCard';

export type EventFilters = {
  category?: EventCategory;
  city?: string;
  q?: string;
};

type EventsViewProps = {
  /** Null when event-service couldn't be reached. */
  list: EventList | null;
  cities: string[];
  filters: EventFilters;
};

/** /events URL for the given filters, dropping empty ones. */
function eventsUrl(filters: EventFilters & { page?: number }): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && !(key === 'page' && value === 1)) {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return query ? `/events?${query}` : '/events';
}

export default function EventsView({ list, cities, filters }: EventsViewProps) {
  const activeCategory = eventCategories.find(item => item.value === filters.category);
  const pageCount = list ? Math.ceil(list.total / list.limit) : 0;

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          {activeCategory ? activeCategory.label : 'All events'}
        </Typography>
        {list && (
          <SecondaryText>
            {`${list.total} ${list.total === 1 ? 'event' : 'events'} on sale`}
          </SecondaryText>
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        {[{ value: undefined, label: 'All' }, ...eventCategories].map(item => (
          <Chip
            key={item.label}
            component={Link}
            href={eventsUrl({ ...filters, category: item.value })}
            label={item.label}
            clickable
            color={filters.category === item.value ? 'primary' : 'default'}
            variant={filters.category === item.value ? 'filled' : 'outlined'}
            sx={{ fontWeight: 700 }}
          />
        ))}
      </Stack>

      {/* A plain GET form: the filters live in the URL, so results are shareable and need no client state. */}
      <Form action="/events">
        {filters.category && <input type="hidden" name="category" value={filters.category} />}
        <Grid container spacing={1.5} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <TextField
              name="q"
              label="Search events or venues"
              defaultValue={filters.q ?? ''}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 8, sm: 4, md: 3 }}>
            <TextField
              select
              name="city"
              label="City"
              defaultValue={filters.city ?? ''}
              size="small"
              fullWidth
              slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
            >
              <option value="">All cities</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 4, sm: 2 }}>
            <GradientButton type="submit" fullWidth sx={{ height: 40, px: 2 }}>
              Search
            </GradientButton>
          </Grid>
        </Grid>
      </Form>

      {!list && (
        <Typography color="error.main" sx={{ py: 6, textAlign: 'center' }}>
          We couldn&apos;t load events right now. Please refresh in a moment.
        </Typography>
      )}

      {list?.events.length === 0 && (
        <Stack spacing={2} sx={{ alignItems: 'center', py: 8, textAlign: 'center' }}>
          <Image src="/icons/empty-state.svg" alt="" width={120} height={120} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No events match those filters
          </Typography>
          <SecondaryText>
            Try a different city or search term, or
            {' '}
            <Link href="/events">see everything on sale</Link>
            .
          </SecondaryText>
        </Stack>
      )}

      {list && list.events.length > 0 && (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {list.events.map(event => (
            <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}

      {list && pageCount > 1 && (
        <Stack sx={{ alignItems: 'center', pt: 2 }}>
          <Pagination
            page={list.page}
            count={pageCount}
            color="primary"
            renderItem={item => (
              <PaginationItem
                component={Link}
                href={eventsUrl({ ...filters, page: item.page ?? 1 })}
                {...item}
              />
            )}
          />
        </Stack>
      )}
    </Stack>
  );
}
