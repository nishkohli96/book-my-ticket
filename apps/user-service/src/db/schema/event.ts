import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  eventCategoryEnum,
  eventStatusEnum,
  seatStatusEnum,
} from './enums.js';

export const eventsSchema = pgTable('events', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull(),
  name: text('name').notNull(),
  category: eventCategoryEnum('category').notNull(),
  status: eventStatusEnum('status').notNull().default('onsale'),
  venueName: text('venue_name').notNull(),
  venueAddress: text('venue_address'),
  city: varchar('city', { length: 120 }).notNull(),
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  doorsLabel: varchar('doors_label', { length: 60 }),
  description: text('description'),
  priceMin: numeric('price_min', { precision: 10, scale: 2 }),
  priceMax: numeric('price_max', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  imageUrl: text('image_url'),
  seatCapacity: integer('seat_capacity').notNull().default(0),
  raw: jsonb('raw'),
  fetchedAt: timestamp('fetched_at', { mode: 'date' }).notNull().defaultNow(),
}, table => [
  uniqueIndex('events_slug_unique').on(table.slug),
  index('events_city_start_date_idx').on(table.city, table.startDate),
]);

export const seatsSchema = pgTable('seats', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => eventsSchema.id, {
    onDelete: 'cascade',
  }),
  section: varchar('section', { length: 20 }).notNull(),
  row: varchar('row', { length: 5 }).notNull(),
  number: integer('number').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  status: seatStatusEnum('status').notNull().default('available'),
}, table => [
  uniqueIndex('seats_event_section_row_number_unique').on(
    table.eventId,
    table.section,
    table.row,
    table.number
  ),
  index('seats_event_id_idx').on(table.eventId),
]);
