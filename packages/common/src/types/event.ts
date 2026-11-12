import type { EventCategory, EventStatus, SeatStatus } from './enums';

export type EventSummary = {
  id: string;
  slug: string;
  name: string;
  category: EventCategory;
  status: EventStatus;
  venueName: string;
  city: string;
  /** ISO 8601 UTC instant - format with `timezone` to show the venue's local time. */
  startDate: string;
  /** IANA timezone of the venue, e.g. "America/New_York". */
  timezone: string;
  priceMin: number;
  priceMax: number;
  currency: string;
  imageUrl: string | null;
};

export type EventDetail = EventSummary & {
  venueAddress: string | null;
  description: string | null;
  seatCapacity: number;
  seatsAvailable: number;
};

export type EventList = {
  events: EventSummary[];
  total: number;
  page: number;
  limit: number;
};

export type Seat = {
  id: string;
  section: string;
  row: string;
  number: number;
  price: number;
  status: SeatStatus;
};
