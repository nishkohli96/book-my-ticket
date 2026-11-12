import { randomBytes, randomUUID } from 'node:crypto';
import { and, desc, eq, inArray } from 'drizzle-orm';
import {
  BookingStatus,
  bookingRules,
  HoldStatus,
  type BookedSeat,
  type Booking
} from '@book-my-ticket/common';
import { HttpError } from '@book-my-ticket/service-kit';
import { postgresDatabase } from '@/db';
import { bookingSeatsSchema, bookingsSchema, holdsSchema } from '@/db/schema';
import { eventClient } from '@/lib/event-client';
import holdService from '../holds/service';

type BookingRow = typeof bookingsSchema.$inferSelect;
type CardDetails = { cardNumber: string; expiry: string };

function toBooking(row: BookingRow, seats: BookedSeat[]): Booking {
  return {
    id: row.id,
    bookingCode: row.bookingCode,
    status: row.status,
    event: row.event,
    seats,
    subtotal: Number(row.subtotal),
    serviceFees: Number(row.serviceFees),
    total: Number(row.total),
    currency: row.currency,
    createdAt: row.createdAt.toISOString(),
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
  };
}

/** e.g. "BMT-7K2M9QXA" - no 0/O or 1/I, so it survives being read out loud. */
function generateBookingCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code = Array.from(randomBytes(8), byte => alphabet[byte % alphabet.length]).join('');
  return `BMT-${code}`;
}

/**
 * Stand-in for a payment gateway. Nothing is charged and no card data is
 * stored - it only rejects an expired card and one known "declined" test
 * number so the failure path can be exercised.
 */
function chargeCard({ cardNumber, expiry }: CardDetails) {
  const [month, year] = expiry.split('/').map(Number);
  /* Cards are valid through the last day of their expiry month. */
  if (new Date(2000 + year, month, 1) <= new Date()) {
    throw new HttpError(402, 'This card has expired.');
  }
  if (cardNumber === bookingRules.declinedTestCard) {
    throw new HttpError(402, 'Your card was declined. Try another card.');
  }
}

class BookingService {
  private async seatsByBooking(bookingIds: string[]): Promise<Map<string, BookedSeat[]>> {
    const seats = new Map<string, BookedSeat[]>();
    if (!bookingIds.length) {
      return seats;
    }
    const rows = await postgresDatabase.db
      .select()
      .from(bookingSeatsSchema)
      .where(inArray(bookingSeatsSchema.bookingId, bookingIds))
      .orderBy(bookingSeatsSchema.row, bookingSeatsSchema.number);

    for (const { bookingId, seatId, price, ...seat } of rows) {
      seats.set(bookingId, [
        ...(seats.get(bookingId) ?? []),
        { id: seatId, price: Number(price), ...seat }
      ]);
    }
    return seats;
  }

  /**
   * Pay for a hold and turn it into a booking. Order matters: charge,
   * then mark the seats sold in event-service, then record the booking.
   * If recording fails the seats are put back on sale, so a seat is never
   * left sold with no booking behind it.
   */
  async checkout(userId: string, holdId: string, card: CardDetails): Promise<Booking> {
    const hold = await holdService.findActiveHold(userId, holdId);
    chargeCard(card);
    await eventClient.confirmHold(hold.id, hold.seats.length);

    try {
      const booking = await postgresDatabase.db.transaction(async tx => {
        const [created] = await tx
          .insert(bookingsSchema)
          .values({
            id: randomUUID(),
            bookingCode: generateBookingCode(),
            userId,
            eventId: hold.eventId,
            event: hold.event,
            subtotal: hold.subtotal,
            serviceFees: hold.serviceFees,
            total: hold.total,
            currency: hold.currency,
          })
          .returning();

        await tx.insert(bookingSeatsSchema).values(
          hold.seats.map(seat => ({
            bookingId: created.id,
            seatId: seat.id,
            section: seat.section,
            row: seat.row,
            number: seat.number,
            price: String(seat.price),
          }))
        );
        await tx
          .update(holdsSchema)
          .set({ status: HoldStatus.CONVERTED })
          .where(eq(holdsSchema.id, hold.id));

        return created;
      });
      return toBooking(booking, hold.seats);
    } catch (error) {
      await eventClient.freeSeats(hold.seats.map(seat => seat.id));
      throw error;
    }
  }

  async listBookings(userId: string): Promise<Booking[]> {
    const rows = await postgresDatabase.db
      .select()
      .from(bookingsSchema)
      .where(eq(bookingsSchema.userId, userId))
      .orderBy(desc(bookingsSchema.createdAt));

    const seats = await this.seatsByBooking(rows.map(row => row.id));
    return rows.map(row => toBooking(row, seats.get(row.id) ?? []));
  }

  private async findBooking(userId: string, bookingId: string): Promise<BookingRow> {
    const [booking] = await postgresDatabase.db
      .select()
      .from(bookingsSchema)
      .where(and(eq(bookingsSchema.id, bookingId), eq(bookingsSchema.userId, userId)))
      .limit(1);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }
    return booking;
  }

  async getBooking(userId: string, bookingId: string): Promise<Booking> {
    const booking = await this.findBooking(userId, bookingId);
    const seats = await this.seatsByBooking([booking.id]);
    return toBooking(booking, seats.get(booking.id) ?? []);
  }

  async cancelBooking(userId: string, bookingId: string): Promise<Booking> {
    const booking = await this.findBooking(userId, bookingId);
    if (booking.status === BookingStatus.CANCELLED) {
      throw new HttpError(409, 'This booking is already cancelled.');
    }
    if (new Date(booking.event.startDate) <= new Date()) {
      throw new HttpError(409, 'This event has already started and can no longer be cancelled.');
    }

    const seats = (await this.seatsByBooking([booking.id])).get(booking.id) ?? [];
    const [cancelled] = await postgresDatabase.db
      .update(bookingsSchema)
      .set({ status: BookingStatus.CANCELLED, cancelledAt: new Date() })
      .where(eq(bookingsSchema.id, booking.id))
      .returning();

    try {
      await eventClient.freeSeats(seats.map(seat => seat.id));
    } catch (error) {
      /* Seats are still sold in event-service - keep the booking valid rather than strand them. */
      await postgresDatabase.db
        .update(bookingsSchema)
        .set({ status: BookingStatus.CONFIRMED, cancelledAt: null })
        .where(eq(bookingsSchema.id, booking.id));
      throw error;
    }
    return toBooking(cancelled, seats);
  }
}

const bookingService = new BookingService();
export default bookingService;
