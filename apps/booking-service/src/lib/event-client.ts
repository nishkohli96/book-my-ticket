import type { BookedSeat, EventSnapshot } from '@book-my-ticket/common';
import { HttpError } from '@book-my-ticket/service-kit';
import { ENV_CONFIG } from '@/constants';

type HeldSeats = {
  event: EventSnapshot;
  currency: string;
  seats: BookedSeat[];
};

/**
 * event-service owns the seats, so every seat state change goes through
 * its internal API rather than touching its tables. Its error status and
 * message are passed straight through (e.g. 409 "seats were just taken").
 */
async function post<T = undefined>(action: string, body: object): Promise<T> {
  const response = await fetch(`${ENV_CONFIG.eventServiceUrl}/internal/seats/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json() as { message?: string; data: T };
  if (!response.ok) {
    throw new HttpError(response.status, result.message ?? 'Seat request failed');
  }
  return result.data;
}

export const eventClient = {
  holdSeats: (body: { eventId: string; seatIds: string[]; holdId: string; ttlSeconds: number }) =>
    post<HeldSeats>('hold', body),
  releaseHold: (holdId: string) => post('release', { holdId }),
  confirmHold: (holdId: string, seatCount: number) => post('confirm', { holdId, seatCount }),
  freeSeats: (seatIds: string[]) => post('free', { seatIds }),
};
