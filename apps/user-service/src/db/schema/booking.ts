import {
  index,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { bookingStatusEnum } from './enums.js';
import { eventsSchema, seatsSchema } from './event.js';
import { usersSchema } from './user.js';

export const bookingsSchema = pgTable('bookings', {
  id: text('id').primaryKey(),
  bookingCode: varchar('booking_code', { length: 20 }).notNull(),
  userId: text('user_id').notNull().references(() => usersSchema.id, {
    onDelete: 'cascade',
  }),
  eventId: text('event_id').notNull().references(() => eventsSchema.id, {
    onDelete: 'restrict',
  }),
  status: bookingStatusEnum('status')
    .notNull()
    .default('confirmed'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  serviceFees: numeric('service_fees', { precision: 10, scale: 2 }).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  createdAt: timestamp('created_at', { mode: 'date' })
    .notNull()
    .defaultNow(),
  cancelledAt: timestamp('cancelled_at', { mode: 'date' }),
}, table => [
  uniqueIndex('bookings_booking_code_unique').on(table.bookingCode),
  index('bookings_user_id_idx').on(table.userId),
  index('bookings_event_id_idx').on(table.eventId),
]);

export const bookingSeatsSchema = pgTable('booking_seats', {
  bookingId: text('booking_id').notNull().references(() => bookingsSchema.id, {
    onDelete: 'cascade',
  }),
  seatId: text('seat_id').notNull().references(() => seatsSchema.id, {
    onDelete: 'restrict',
  }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
}, table => [
  primaryKey({ columns: [table.bookingId, table.seatId] }),
]);
