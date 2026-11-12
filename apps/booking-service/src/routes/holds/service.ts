import { randomUUID } from 'node:crypto';
import { and, eq, gt } from 'drizzle-orm';
import {
  bookingRules,
  HoldStatus,
  type CreateHoldData,
  type SeatHold
} from '@book-my-ticket/common';
import { HttpError } from '@book-my-ticket/service-kit';
import { postgresDatabase } from '@/db';
import { holdsSchema } from '@/db/schema';
import { eventClient } from '@/lib/event-client';

type HoldRow = typeof holdsSchema.$inferSelect;

export function toSeatHold(row: HoldRow): SeatHold {
  return {
    id: row.id,
    event: row.event,
    seats: row.seats,
    subtotal: Number(row.subtotal),
    serviceFees: Number(row.serviceFees),
    total: Number(row.total),
    currency: row.currency,
    expiresAt: row.expiresAt.toISOString(),
  };
}

const roundMoney = (amount: number) => Math.round(amount * 100) / 100;

class HoldService {
  /** The user's hold, only while it can still be checked out. */
  async findActiveHold(userId: string, holdId: string): Promise<HoldRow> {
    const [hold] = await postgresDatabase.db
      .select()
      .from(holdsSchema)
      .where(
        and(
          eq(holdsSchema.id, holdId),
          eq(holdsSchema.userId, userId),
          eq(holdsSchema.status, HoldStatus.ACTIVE),
          gt(holdsSchema.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!hold) {
      throw new HttpError(404, 'This seat hold has expired. Pick your seats again.');
    }
    return hold;
  }

  /**
   * One hold per user: starting a new one hands back whatever they were
   * holding before, so nobody can sit on several sets of seats at once.
   */
  async createHold(userId: string, { eventId, seatIds }: CreateHoldData): Promise<SeatHold> {
    const previousHolds = await postgresDatabase.db
      .update(holdsSchema)
      .set({ status: HoldStatus.RELEASED })
      .where(and(eq(holdsSchema.userId, userId), eq(holdsSchema.status, HoldStatus.ACTIVE)))
      .returning({ id: holdsSchema.id });
    await Promise.all(previousHolds.map(hold => eventClient.releaseHold(hold.id)));

    const holdId = randomUUID();
    const { event, currency, seats } = await eventClient.holdSeats({
      eventId,
      seatIds,
      holdId,
      ttlSeconds: bookingRules.holdDurationSeconds,
    });

    const subtotal = roundMoney(seats.reduce((sum, seat) => sum + seat.price, 0));
    const serviceFees = roundMoney(subtotal * bookingRules.serviceFeeRate);

    try {
      const [hold] = await postgresDatabase.db
        .insert(holdsSchema)
        .values({
          id: holdId,
          userId,
          eventId,
          event,
          seats,
          subtotal: String(subtotal),
          serviceFees: String(serviceFees),
          total: String(roundMoney(subtotal + serviceFees)),
          currency,
          expiresAt: new Date(Date.now() + bookingRules.holdDurationSeconds * 1000),
        })
        .returning();
      return toSeatHold(hold);
    } catch (error) {
      /* Seats are locked in event-service but we have no record of why - give them back. */
      await eventClient.releaseHold(holdId);
      throw error;
    }
  }

  async getHold(userId: string, holdId: string): Promise<SeatHold> {
    return toSeatHold(await this.findActiveHold(userId, holdId));
  }

  async releaseHold(userId: string, holdId: string) {
    const [released] = await postgresDatabase.db
      .update(holdsSchema)
      .set({ status: HoldStatus.RELEASED })
      .where(
        and(
          eq(holdsSchema.id, holdId),
          eq(holdsSchema.userId, userId),
          eq(holdsSchema.status, HoldStatus.ACTIVE)
        )
      )
      .returning({ id: holdsSchema.id });

    if (released) {
      await eventClient.releaseHold(released.id);
    }
  }
}

const holdService = new HoldService();
export default holdService;
