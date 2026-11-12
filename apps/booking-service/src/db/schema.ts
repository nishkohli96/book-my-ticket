/**
 * Re-run after any change here:
 * cd apps/booking-service && pnpm db:push
 *
 * Own Postgres schema ("bookings"). There are deliberately no foreign keys
 * to users or events - those rows belong to other services. Ids are plain
 * references and the event's display fields are copied in as a snapshot.
 */
import {
  index,
  integer,
  jsonb,
  numeric,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core';
import {
  BookingStatus,
  HoldStatus,
  type BookedSeat,
  type EventSnapshot
} from '@book-my-ticket/common';

export const bookingsDbSchema = pgSchema('bookings');

export const holdStatusEnum = bookingsDbSchema.enum('hold_status', HoldStatus);
export const bookingStatusEnum = bookingsDbSchema.enum('booking_status', BookingStatus);

const priceColumns = {
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  serviceFees: numeric('service_fees', { precision: 10, scale: 2 }).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
};

/** Seats reserved for a user while they check out. event-service enforces the actual lock. */
export const holdsSchema = bookingsDbSchema.table('holds', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  eventId: text('event_id').notNull(),
  event: jsonb('event').$type<EventSnapshot>().notNull(),
  seats: jsonb('seats').$type<BookedSeat[]>().notNull(),
  ...priceColumns,
  status: holdStatusEnum('status')
    .notNull()
    .default(HoldStatus.ACTIVE),
  expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
}, table => [
  index('holds_user_id_status_idx').on(table.userId, table.status),
]);

export const bookingsSchema = bookingsDbSchema.table('bookings', {
  id: text('id').primaryKey(),
  /** Human-friendly reference printed on the ticket and encoded in its QR code. */
  bookingCode: varchar('booking_code', { length: 20 }).notNull(),
  userId: text('user_id').notNull(),
  eventId: text('event_id').notNull(),
  event: jsonb('event').$type<EventSnapshot>().notNull(),
  status: bookingStatusEnum('status')
    .notNull()
    .default(BookingStatus.CONFIRMED),
  ...priceColumns,
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  cancelledAt: timestamp('cancelled_at', { mode: 'date', withTimezone: true }),
}, table => [
  uniqueIndex('bookings_booking_code_unique').on(table.bookingCode),
  index('bookings_user_id_idx').on(table.userId),
  index('bookings_event_id_idx').on(table.eventId),
]);

export const bookingSeatsSchema = bookingsDbSchema.table('booking_seats', {
  bookingId: text('booking_id')
    .notNull()
    .references(() => bookingsSchema.id, { onDelete: 'cascade' }),
  seatId: text('seat_id').notNull(),
  section: varchar('section', { length: 20 }).notNull(),
  row: varchar('row', { length: 5 }).notNull(),
  number: integer('number').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
}, table => [
  primaryKey({ columns: [table.bookingId, table.seatId] }),
]);
