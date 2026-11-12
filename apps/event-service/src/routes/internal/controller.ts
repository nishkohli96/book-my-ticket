import { Router, type Request } from 'express';
import { z } from 'zod';
import { HttpError, sendSuccessResponse } from '@book-my-ticket/service-kit';
import seatLockService from './service';

/**
 * Service-to-service only. Mounted under "/internal", which the gateway
 * never routes (Traefik only forwards "/api/event"), so these are
 * reachable from other containers on the network but not from outside.
 */
const internalSeatsRouter = Router();

const holdSchema = z.object({
  eventId: z.string().min(1),
  seatIds: z.array(z.string().min(1)).min(1),
  holdId: z.string().min(1),
  ttlSeconds: z.number().int().positive(),
});
const holdIdSchema = z.object({ holdId: z.string().min(1) });
const confirmSchema = holdIdSchema.extend({ seatCount: z.number().int().positive() });
const freeSchema = z.object({ seatIds: z.array(z.string().min(1)).min(1) });

function parseBody<T>(schema: z.ZodType<T>, req: Request): T {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid request', parsed.error.issues.map(issue => issue.message));
  }
  return parsed.data;
}

internalSeatsRouter.post('/hold', async (req, res) => {
  const data = await seatLockService.holdSeats(parseBody(holdSchema, req));
  return sendSuccessResponse(res, { statusCode: 201, data });
});

internalSeatsRouter.post('/release', async (req, res) => {
  await seatLockService.releaseHold(parseBody(holdIdSchema, req).holdId);
  return sendSuccessResponse(res, { message: 'Seats released.' });
});

internalSeatsRouter.post('/confirm', async (req, res) => {
  const { holdId, seatCount } = parseBody(confirmSchema, req);
  await seatLockService.confirmHold(holdId, seatCount);
  return sendSuccessResponse(res, { message: 'Seats booked.' });
});

internalSeatsRouter.post('/free', async (req, res) => {
  await seatLockService.freeSeats(parseBody(freeSchema, req).seatIds);
  return sendSuccessResponse(res, { message: 'Seats back on sale.' });
});

export { internalSeatsRouter };
