/**
 * Re-run after any change here:
 * cd apps/event-service && pnpm db:push
 *
 * Everything lives in its own Postgres schema ("events"), so this service
 * owns its tables outright even though the Neon instance is shared.
 */
import {
  index,
  integer,
  jsonb,
  numeric,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core';
import { EventCategory, EventStatus, SeatStatus } from '@book-my-ticket/common';

export const eventsDbSchema = pgSchema('events');

export const eventCategoryEnum = eventsDbSchema.enum('event_category', EventCategory);
export const eventStatusEnum = eventsDbSchema.enum('event_status', EventStatus);
export const seatStatusEnum = eventsDbSchema.enum('seat_status', SeatStatus);

export const eventsSchema = eventsDbSchema.table('events', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull(),
  name: text('name').notNull(),
  category: eventCategoryEnum('category').notNull(),
  status: eventStatusEnum('status')
    .notNull()
    .default(EventStatus.ONSALE),
  venueName: text('venue_name').notNull(),
  venueAddress: text('venue_address'),
  city: varchar('city', { length: 120 }).notNull(),
  startDate: timestamp('start_date', { mode: 'date', withTimezone: true }).notNull(),
  /** IANA timezone of the venue - start_date is an instant, this says how to display it. */
  timezone: varchar('timezone', { length: 60 }).notNull(),
  description: text('description'),
  priceMin: numeric('price_min', { precision: 10, scale: 2 }).notNull(),
  priceMax: numeric('price_max', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 })
    .notNull()
    .default('USD'),
  imageUrl: text('image_url'),
  seatCapacity: integer('seat_capacity')
    .notNull()
    .default(0),
  /** Untouched source payload (Ticketmaster), kept for fields not modelled above. */
  raw: jsonb('raw'),
  fetchedAt: timestamp('fetched_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
}, table => [
  uniqueIndex('events_slug_unique').on(table.slug),
  index('events_category_start_date_idx').on(table.category, table.startDate),
  index('events_city_start_date_idx').on(table.city, table.startDate),
]);

export const seatsSchema = eventsDbSchema.table('seats', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => eventsSchema.id, { onDelete: 'cascade' }),
  section: varchar('section', { length: 20 }).notNull(),
  row: varchar('row', { length: 5 }).notNull(),
  number: integer('number').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  status: seatStatusEnum('status')
    .notNull()
    .default(SeatStatus.AVAILABLE),
  /**
   * Set while status is "held". A held seat whose held_until has passed
   * counts as available again - no cleanup job needed, every query that
   * reads or claims seats checks the timestamp.
   */
  holdId: text('hold_id'),
  heldUntil: timestamp('held_until', { mode: 'date', withTimezone: true }),
}, table => [
  uniqueIndex('seats_event_section_row_number_unique').on(
    table.eventId,
    table.section,
    table.row,
    table.number
  ),
  index('seats_event_id_idx').on(table.eventId),
  index('seats_hold_id_idx').on(table.holdId),
]);
