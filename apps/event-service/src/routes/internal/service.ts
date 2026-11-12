import { and, eq, gt, inArray, sql } from 'drizzle-orm';
import {
  EventStatus,
  SeatStatus,
  type BookedSeat,
  type EventSnapshot
} from '@book-my-ticket/common';
import { HttpError } from '@book-my-ticket/service-kit';
import { postgresDatabase } from '@/db';
import { eventsSchema, seatsSchema } from '@/db/schema';
import { seatIsAvailable } from '../events/service';

export type HoldSeatsInput = {
  eventId: string;
  seatIds: string[];
  holdId: string;
  ttlSeconds: number;
};

export type HoldSeatsResult = {
  event: EventSnapshot;
  currency: string;
  seats: BookedSeat[];
};

const seatColumns = {
  id: seatsSchema.id,
  section: seatsSchema.section,
  row: seatsSchema.row,
  number: seatsSchema.number,
  price: seatsSchema.price,
};

class SeatLockService {
  /**
   * All-or-nothing: the UPDATE only matches seats that are free right now,
   * so two buyers racing for the same seat can't both win - Postgres row
   * locks make the loser's UPDATE see the winner's result. If fewer rows
   * come back than were asked for, the whole transaction rolls back.
   */
  async holdSeats({ eventId, seatIds, holdId, ttlSeconds }: HoldSeatsInput): Promise<HoldSeatsResult> {
    const [event] = await postgresDatabase.db
      .select({
        id: eventsSchema.id,
        slug: eventsSchema.slug,
        name: eventsSchema.name,
        venueName: eventsSchema.venueName,
        city: eventsSchema.city,
        startDate: eventsSchema.startDate,
        timezone: eventsSchema.timezone,
        imageUrl: eventsSchema.imageUrl,
        currency: eventsSchema.currency,
      })
      .from(eventsSchema)
      .where(
        and(
          eq(eventsSchema.id, eventId),
          eq(eventsSchema.status, EventStatus.ONSALE),
          gt(eventsSchema.startDate, sql`now()`)
        )
      )
      .limit(1);

    if (!event) {
      throw new HttpError(404, 'This event is not on sale');
    }

    const seats = await postgresDatabase.db.transaction(async tx => {
      const held = await tx
        .update(seatsSchema)
        .set({
          status: SeatStatus.HELD,
          holdId,
          heldUntil: sql`now() + make_interval(secs => ${ttlSeconds})`,
        })
        .where(
          and(
            eq(seatsSchema.eventId, eventId),
            inArray(seatsSchema.id, seatIds),
            seatIsAvailable
          )
        )
        .returning(seatColumns);

      if (held.length !== seatIds.length) {
        throw new HttpError(409, 'One or more of those seats were just taken. Pick again.');
      }
      return held;
    });

    const { currency, startDate, ...snapshot } = event;
    return {
      event: { ...snapshot, startDate: startDate.toISOString() },
      currency,
      seats: seats.map(seat => ({ ...seat, price: Number(seat.price) })),
    };
  }

  /** Hand seats back early (user abandoned checkout, or started a new hold). */
  async releaseHold(holdId: string) {
    await postgresDatabase.db
      .update(seatsSchema)
      .set({ status: SeatStatus.AVAILABLE, holdId: null, heldUntil: null })
      .where(and(eq(seatsSchema.holdId, holdId), eq(seatsSchema.status, SeatStatus.HELD)));
  }

  /**
   * Turn a still-valid hold into sold seats. Fails if the hold lapsed - by
   * then someone else may already hold those seats.
   */
  async confirmHold(holdId: string, seatCount: number) {
    await postgresDatabase.db.transaction(async tx => {
      const booked = await tx
        .update(seatsSchema)
        .set({ status: SeatStatus.BOOKED, heldUntil: null })
        .where(
          and(
            eq(seatsSchema.holdId, holdId),
            eq(seatsSchema.status, SeatStatus.HELD),
            sql`${seatsSchema.heldUntil} > now()`
          )
        )
        .returning({ id: seatsSchema.id });

      if (booked.length !== seatCount) {
        throw new HttpError(409, 'Your seat hold expired. Pick your seats again.');
      }
    });
  }

  /** Put booked seats back on sale after a cancellation. */
  async freeSeats(seatIds: string[]) {
    await postgresDatabase.db
      .update(seatsSchema)
      .set({ status: SeatStatus.AVAILABLE, holdId: null, heldUntil: null })
      .where(and(inArray(seatsSchema.id, seatIds), eq(seatsSchema.status, SeatStatus.BOOKED)));
  }
}

const seatLockService = new SeatLockService();
export default seatLockService;
