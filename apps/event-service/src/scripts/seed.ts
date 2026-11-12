/**
 * Pulls upcoming US events from the Ticketmaster Discovery API and
 * generates a seat map for each (Ticketmaster doesn't expose real ones).
 *
 *   cd apps/event-service && pnpm seed
 *
 * Safe to re-run: events are upserted and existing seats are left alone,
 * so seats that are already held or booked keep their state.
 */
import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { defEnvVariable, EventCategory, EventStatus } from '@book-my-ticket/common';
import { logger } from '@book-my-ticket/service-kit';
import { postgresDatabase } from '@/db';
import { eventsSchema, seatsSchema } from '@/db/schema';

const EVENTS_PER_CATEGORY = 24;

/**
 * Ticketmaster search params per category, and the price range used when
 * an event lists none. Theatre is searched by genre id in random order:
 * by relevance the results are a few hundred nights of the same show.
 */
const categories = [
  { category: EventCategory.CONCERT, search: { classificationName: 'music' }, prices: [45, 250] },
  { category: EventCategory.SPORTS, search: { classificationName: 'sports' }, prices: [30, 300] },
  { category: EventCategory.THEATER, search: { genreId: 'KnvZfZ7v7l1', sort: 'random' }, prices: [40, 180] },
  { category: EventCategory.COMEDY, search: { classificationName: 'comedy' }, prices: [25, 90] },
] as const;

/** Front to back. `tier` picks the price: 0 = most expensive. */
const seatLayout = [
  { section: 'Floor', rows: ['A', 'B', 'C', 'D'], seatsPerRow: 12, tier: 0 },
  { section: 'Lower', rows: ['E', 'F', 'G', 'H', 'J'], seatsPerRow: 14, tier: 1 },
  { section: 'Upper', rows: ['K', 'L', 'M', 'N'], seatsPerRow: 16, tier: 2 },
];

/** Listings that are add-ons rather than the event itself. */
const notAnEvent = /parking|package|voucher|upgrade|upsell|\bvip\b|\bpass\b|suite|deposit|gift card|meet & greet/i;

type TicketmasterEvent = {
  id: string;
  name: string;
  info?: string;
  description?: string;
  pleaseNote?: string;
  images?: { ratio?: string; width: number; url: string }[];
  dates: {
    start: { dateTime?: string; dateTBD?: boolean; dateTBA?: boolean; timeTBA?: boolean };
    timezone?: string;
    status?: { code?: string };
  };
  priceRanges?: { min?: number; max?: number; currency?: string }[];
  _embedded?: {
    venues?: {
      name?: string;
      timezone?: string;
      city?: { name?: string };
      state?: { stateCode?: string };
      address?: { line1?: string };
    }[];
  };
};

function slugify(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return `${base}-${id.toLowerCase().slice(-6)}`;
}

/** Stable pseudo-random 0..1 from the event id, so re-seeding gives the same fallback prices. */
function seededFraction(id: string): number {
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  }
  return hash / 9973;
}

function pickPrices(event: TicketmasterEvent, [low, high]: readonly [number, number]) {
  const range = event.priceRanges?.find(price => price.min && price.max && price.max > price.min);
  if (range?.min && range.max) {
    return { priceMin: Math.round(range.min), priceMax: Math.round(range.max) };
  }
  const fraction = seededFraction(event.id);
  const priceMin = Math.round(low + (high - low) * 0.3 * fraction);
  const priceMax = Math.round(priceMin + (high - priceMin) * (0.5 + 0.5 * fraction));
  return { priceMin, priceMax };
}

/** Widest 16:9 image that isn't needlessly huge. */
function pickImage(event: TicketmasterEvent): string | null {
  const wide = (event.images ?? [])
    .filter(image => image.ratio === '16_9')
    .sort((a, b) => a.width - b.width);
  return (wide.find(image => image.width >= 1024) ?? wide.at(-1))?.url ?? null;
}

async function fetchEvents(search: Record<string, string>): Promise<TicketmasterEvent[]> {
  const params = new URLSearchParams({
    apikey: defEnvVariable('TICKETMASTER_API_KEY'),
    countryCode: 'US',
    startDateTime: `${new Date().toISOString().slice(0, 19)}Z`,
    sort: 'relevance,desc',
    size: '200',
    ...search,
  });
  const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
  if (!response.ok) {
    throw new Error(`Ticketmaster responded ${response.status} for ${JSON.stringify(search)}`);
  }
  const body = await response.json() as { _embedded?: { events?: TicketmasterEvent[] } };
  return body._embedded?.events ?? [];
}

async function seedCategory({ category, search, prices }: typeof categories[number]) {
  const seenNames = new Set<string>();
  const events = (await fetchEvents(search))
    .filter(event => {
      const venue = event._embedded?.venues?.[0];
      const { start } = event.dates;
      const usable = Boolean(start.dateTime)
        && !start.dateTBD && !start.dateTBA && !start.timeTBA
        && event.dates.status?.code === 'onsale'
        && Boolean(venue?.name && venue.city?.name)
        && !notAnEvent.test(event.name)
        /* The same tour shows up once per night - one listing each is enough. */
        && !seenNames.has(event.name);
      if (usable) {
        seenNames.add(event.name);
      }
      return usable;
    })
    .slice(0, EVENTS_PER_CATEGORY);

  for (const event of events) {
    const venue = event._embedded!.venues![0];
    const { priceMin, priceMax } = pickPrices(event, prices);
    const tierPrices = [priceMax, Math.round((priceMin + priceMax) / 2), priceMin];
    const seats = seatLayout.flatMap(({ section, rows, seatsPerRow, tier }) =>
      rows.flatMap(row =>
        Array.from({ length: seatsPerRow }, (_, index) => ({
          id: `${event.id}-${row}${index + 1}`,
          eventId: event.id,
          section,
          row,
          number: index + 1,
          price: String(tierPrices[tier]),
        }))));

    const values = {
      id: event.id,
      slug: slugify(event.name, event.id),
      name: event.name,
      category,
      status: EventStatus.ONSALE,
      venueName: venue.name!,
      venueAddress: [venue.address?.line1, venue.state?.stateCode].filter(Boolean).join(', ') || null,
      city: venue.city!.name!,
      startDate: new Date(event.dates.start.dateTime!),
      timezone: event.dates.timezone ?? venue.timezone ?? 'America/New_York',
      description: event.info ?? event.description ?? event.pleaseNote ?? null,
      priceMin: String(priceMin),
      priceMax: String(priceMax),
      currency: 'USD',
      imageUrl: pickImage(event),
      seatCapacity: seats.length,
      raw: event,
      fetchedAt: new Date(),
    };

    await postgresDatabase.db.transaction(async tx => {
      await tx
        .insert(eventsSchema)
        .values(values)
        .onConflictDoUpdate({
          target: eventsSchema.id,
          /* Keep the id and slug stable - links to the event depend on them. */
          set: { ...values, id: undefined, slug: undefined }
        });
      await tx.insert(seatsSchema).values(seats).onConflictDoNothing();
    });
  }

  logger.info(`Seeded ${events.length} ${category} events`);
}

async function seed() {
  await postgresDatabase.connect();
  for (const config of categories) {
    await seedCategory(config);
  }
  const [{ events, seats }] = (await postgresDatabase.db.execute<{ events: number; seats: number }>(sql`
    select
      (select count(*)::int from ${eventsSchema}) as events,
      (select count(*)::int from ${seatsSchema}) as seats
  `)).rows;
  logger.info(`Database now has ${events} events and ${seats} seats`);
  await postgresDatabase.disconnect();
}

seed().catch((error: unknown) => {
  logger.error(`Seed failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
