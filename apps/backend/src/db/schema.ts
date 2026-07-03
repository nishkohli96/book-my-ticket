import {
  pgTable,
  pgEnum,
  text,
  varchar,
  timestamp,
  integer,
  numeric,
  primaryKey,
  uniqueIndex,
  index,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const eventCategoryEnum = pgEnum('event_category', [
  'concert',
  'sports',
  'theater',
  'comedy',
]);

export const eventStatusEnum = pgEnum('event_status', [
  'onsale',
  'offsale',
  'cancelled',
  'postponed',
  'rescheduled',
]);

// Postgres is the durable source of truth for "booked" seats. "held" is a
// Redis-only, TTL'd state (see PRD UC3/UC8) and never persisted here — a seat
// is either free for anyone to try to hold, or permanently sold.
export const seatStatusEnum = pgEnum('seat_status', ['available', 'booked']);

export const bookingStatusEnum = pgEnum('booking_status', ['confirmed', 'cancelled']);

// ---------------------------------------------------------------------------
// Auth.js (NextAuth) core tables — schema matches @auth/drizzle-adapter's
// expectations so the adapter can be dropped in without modification.
// ---------------------------------------------------------------------------

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Auth.js generates this (cuid/uuid)
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),

  // Credentials-based signup support. Null for users who only ever used an
  // OAuth provider — the presence of a hash is what makes password login valid.
  passwordHash: text('password_hash'),

  phone: varchar('phone', { length: 20 }),
  city: varchar('city', { length: 120 }),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
}, table => [
  uniqueIndex('users_email_unique').on(table.email),
]);

export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // "oauth" | "oidc" | "email" | "credentials"
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
}, table => [
  primaryKey({ columns: [table.provider, table.providerAccountId] }),
  index('accounts_user_id_idx').on(table.userId),
]);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, table => [
  primaryKey({ columns: [table.identifier, table.token] }),
]);

// ---------------------------------------------------------------------------
// Events — a Redis-fronted cache of Ticketmaster Discovery API results
// (PRD UC1/UC7). Postgres holds the durable copy so browse/detail pages
// still work if Ticketmaster is down (PRD "graceful degradation").
// ---------------------------------------------------------------------------

export const events = pgTable('events', {
  id: text('id').primaryKey(), // Ticketmaster event id
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

  // Synthetic seat map capacity used to generate `seats` rows for this event.
  seatCapacity: integer('seat_capacity').notNull().default(0),

  // Full upstream payload, kept for fields we haven't modeled yet.
  raw: jsonb('raw'),

  fetchedAt: timestamp('fetched_at', { mode: 'date' }).notNull().defaultNow(),
}, table => [
  uniqueIndex('events_slug_unique').on(table.slug),
  index('events_city_start_date_idx').on(table.city, table.startDate),
]);

// ---------------------------------------------------------------------------
// Seats — synthetic map generated per event from `seatCapacity` (PRD UC2).
// ---------------------------------------------------------------------------

export const seats = pgTable('seats', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  section: varchar('section', { length: 20 }).notNull(),
  row: varchar('row', { length: 5 }).notNull(),
  number: integer('number').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  status: seatStatusEnum('status').notNull().default('available'),
}, table => [
  uniqueIndex('seats_event_section_row_number_unique').on(table.eventId, table.section, table.row, table.number),
  index('seats_event_id_idx').on(table.eventId),
]);

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  bookingCode: varchar('booking_code', { length: 20 }).notNull(), // e.g. BMT-8F3A-2K9Q
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'restrict' }),
  status: bookingStatusEnum('status').notNull().default('confirmed'),

  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  serviceFees: numeric('service_fees', { precision: 10, scale: 2 }).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  cancelledAt: timestamp('cancelled_at', { mode: 'date' }),
}, table => [
  uniqueIndex('bookings_booking_code_unique').on(table.bookingCode),
  index('bookings_user_id_idx').on(table.userId),
  index('bookings_event_id_idx').on(table.eventId),
]);

// Join table: which seats belong to a booking. Price is copied at booking
// time so a later price change on `seats` never rewrites history.
export const bookingSeats = pgTable('booking_seats', {
  bookingId: text('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  seatId: text('seat_id').notNull().references(() => seats.id, { onDelete: 'restrict' }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
}, table => [
  primaryKey({ columns: [table.bookingId, table.seatId] }),
]);

// ---------------------------------------------------------------------------
// Relations (enables Drizzle's relational query API: db.query.bookings.findMany({ with: { seats: true } }))
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  bookings: many(bookings),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  seats: many(seats),
  bookings: many(bookings),
}));

export const seatsRelations = relations(seats, ({ one, many }) => ({
  event: one(events, { fields: [seats.eventId], references: [events.id] }),
  bookingSeats: many(bookingSeats),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
  seats: many(bookingSeats),
}));

export const bookingSeatsRelations = relations(bookingSeats, ({ one }) => ({
  booking: one(bookings, { fields: [bookingSeats.bookingId], references: [bookings.id] }),
  seat: one(seats, { fields: [bookingSeats.seatId], references: [seats.id] }),
}));
