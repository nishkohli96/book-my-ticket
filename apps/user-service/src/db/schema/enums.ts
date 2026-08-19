import { pgEnum } from 'drizzle-orm/pg-core';

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

export const seatStatusEnum = pgEnum('seat_status', ['available', 'booked']);

export const bookingStatusEnum = pgEnum('booking_status', [
  'confirmed',
  'cancelled',
]);
