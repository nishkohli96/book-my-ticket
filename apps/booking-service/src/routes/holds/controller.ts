import { Router } from 'express';
import { checkoutSchema, createHoldSchema } from '@book-my-ticket/common';
import { authenticate, sendSuccessResponse } from '@book-my-ticket/service-kit';
import { parseBody } from '@/lib/parse';
import bookingService from '../bookings/service';
import holdService from './service';

const holdsRouter = Router();

/* req.userId is always set below - every route sits behind `authenticate`. */
holdsRouter.use(authenticate);

/**
 * POST: /api/booking/holds
 * Reserve seats for the checkout countdown.
 */
holdsRouter.post('/', async (req, res) => {
  const data = parseBody(createHoldSchema, req.body, 'Invalid seat selection');
  const hold = await holdService.createHold(req.userId as string, data);
  return sendSuccessResponse(res, { statusCode: 201, data: hold });
});

/**
 * GET: /api/booking/holds/:id
 */
holdsRouter.get('/:id', async (req, res) => {
  return sendSuccessResponse(res, {
    data: await holdService.getHold(req.userId as string, req.params.id)
  });
});

/**
 * DELETE: /api/booking/holds/:id
 * Give the seats back before the countdown runs out.
 */
holdsRouter.delete('/:id', async (req, res) => {
  await holdService.releaseHold(req.userId as string, req.params.id);
  return sendSuccessResponse(res, { message: 'Seats released.' });
});

/**
 * POST: /api/booking/holds/:id/checkout
 * Pay (mock) and convert the hold into a booking.
 */
holdsRouter.post('/:id/checkout', async (req, res) => {
  const card = parseBody(checkoutSchema, req.body, 'Invalid payment details');
  const booking = await bookingService.checkout(req.userId as string, req.params.id, card);
  return sendSuccessResponse(res, {
    statusCode: 201,
    message: 'Booking confirmed.',
    data: booking
  });
});

export { holdsRouter };
