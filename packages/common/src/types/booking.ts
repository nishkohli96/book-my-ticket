import type { BookingStatus } from './enums';
import type { EventSummary, Seat } from './event';

/** Copy of the event's display fields, stored with a hold/booking so it never needs a cross-service join. */
export type EventSnapshot = Pick<
  EventSummary,
  'id' | 'slug' | 'name' | 'venueName' | 'city' | 'startDate' | 'timezone' | 'imageUrl'
>;

export type BookedSeat = Omit<Seat, 'status'>;

export type PriceBreakdown = {
  subtotal: number;
  serviceFees: number;
  total: number;
  currency: string;
};

export type SeatHold = PriceBreakdown & {
  id: string;
  event: EventSnapshot;
  seats: BookedSeat[];
  /** ISO 8601 UTC instant after which the seats go back on sale. */
  expiresAt: string;
};

export type Booking = PriceBreakdown & {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  event: EventSnapshot;
  seats: BookedSeat[];
  createdAt: string;
  cancelledAt: string | null;
};
