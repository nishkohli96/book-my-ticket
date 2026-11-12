import {
  and,
  asc,
  count,
  eq,
  gt,
  ilike,
  or,
  sql
} from 'drizzle-orm';
import {
  EventStatus,
  SeatStatus,
  type EventDetail,
  type EventList,
  type EventListQuery,
  type EventSummary,
  type Seat
} from '@book-my-ticket/common';
import { HttpError } from '@book-my-ticket/service-kit';
import { postgresDatabase } from '@/db';
import { eventsSchema, seatsSchema } from '@/db/schema';

const summaryColumns = {
  id: eventsSchema.id,
  slug: eventsSchema.slug,
  name: eventsSchema.name,
  category: eventsSchema.category,
  status: eventsSchema.status,
  venueName: eventsSchema.venueName,
  city: eventsSchema.city,
  startDate: eventsSchema.startDate,
  timezone: eventsSchema.timezone,
  priceMin: eventsSchema.priceMin,
  priceMax: eventsSchema.priceMax,
  currency: eventsSchema.currency,
  imageUrl: eventsSchema.imageUrl,
};

type SummaryRow = Omit<EventSummary, 'startDate' | 'priceMin' | 'priceMax'> & {
  startDate: Date;
  priceMin: string;
  priceMax: string;
};

export function toEventSummary(row: SummaryRow): EventSummary {
  return {
    ...row,
    startDate: row.startDate.toISOString(),
    priceMin: Number(row.priceMin),
    priceMax: Number(row.priceMax),
  };
}

/** A seat whose hold has lapsed is on sale again, whatever its stored status says. */
export const seatIsAvailable = or(
  eq(seatsSchema.status, SeatStatus.AVAILABLE),
  and(
    eq(seatsSchema.status, SeatStatus.HELD),
    sql`${seatsSchema.heldUntil} < now()`
  )
);

/** Only events people can still buy tickets for. */
const isBookable = and(
  eq(eventsSchema.status, EventStatus.ONSALE),
  gt(eventsSchema.startDate, sql`now()`)
);

class EventService {
  async listEvents({ category, city, q, page, limit }: EventListQuery): Promise<EventList> {
    const filters = and(
      isBookable,
      category ? eq(eventsSchema.category, category) : undefined,
      city ? ilike(eventsSchema.city, city) : undefined,
      q
        ? or(
          ilike(eventsSchema.name, `%${q}%`),
          ilike(eventsSchema.venueName, `%${q}%`)
        )
        : undefined
    );

    const [rows, [{ total }]] = await Promise.all([
      postgresDatabase.db
        .select(summaryColumns)
        .from(eventsSchema)
        .where(filters)
        .orderBy(asc(eventsSchema.startDate))
        .limit(limit)
        .offset((page - 1) * limit),
      postgresDatabase.db
        .select({ total: count() })
        .from(eventsSchema)
        .where(filters),
    ]);

    return {
      events: rows.map(toEventSummary),
      total,
      page,
      limit
    };
  }

  /** Cities that currently have something on sale, for the browse filter. */
  async listCities(): Promise<string[]> {
    const rows = await postgresDatabase.db
      .selectDistinct({ city: eventsSchema.city })
      .from(eventsSchema)
      .where(isBookable)
      .orderBy(asc(eventsSchema.city));
    return rows.map(row => row.city);
  }

  async getEventBySlug(slug: string): Promise<EventDetail> {
    const [event] = await postgresDatabase.db
      .select({
        ...summaryColumns,
        venueAddress: eventsSchema.venueAddress,
        description: eventsSchema.description,
        seatCapacity: eventsSchema.seatCapacity,
      })
      .from(eventsSchema)
      .where(eq(eventsSchema.slug, slug))
      .limit(1);

    if (!event) {
      throw new HttpError(404, 'Event not found');
    }

    const [{ seatsAvailable }] = await postgresDatabase.db
      .select({ seatsAvailable: count() })
      .from(seatsSchema)
      .where(and(eq(seatsSchema.eventId, event.id), seatIsAvailable));

    return {
      ...toEventSummary(event),
      venueAddress: event.venueAddress,
      description: event.description,
      seatCapacity: event.seatCapacity,
      seatsAvailable
    };
  }

  async listSeats(eventId: string): Promise<Seat[]> {
    const rows = await postgresDatabase.db
      .select({
        id: seatsSchema.id,
        section: seatsSchema.section,
        row: seatsSchema.row,
        number: seatsSchema.number,
        price: seatsSchema.price,
        status: seatsSchema.status,
        heldUntil: seatsSchema.heldUntil,
      })
      .from(seatsSchema)
      .where(eq(seatsSchema.eventId, eventId))
      .orderBy(asc(seatsSchema.row), asc(seatsSchema.number));

    const now = Date.now();
    return rows.map(({ heldUntil, ...seat }) => ({
      ...seat,
      price: Number(seat.price),
      status: seat.status === SeatStatus.HELD && heldUntil && heldUntil.getTime() < now
        ? SeatStatus.AVAILABLE
        : seat.status,
    }));
  }
}

const eventService = new EventService();
export default eventService;
