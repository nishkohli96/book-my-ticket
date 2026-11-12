import { Router } from 'express';
import { authenticate, sendSuccessResponse } from '@book-my-ticket/service-kit';
import bookingService from './service';

const bookingsRouter = Router();

/* req.userId is always set below - every route sits behind `authenticate`. */
bookingsRouter.use(authenticate);

/**
 * GET: /api/booking/bookings
 * The signed-in user's bookings, newest first.
 */
bookingsRouter.get('/', async (req, res) => {
  return sendSuccessResponse(res, {
    data: await bookingService.listBookings(req.userId as string)
  });
});

/**
 * GET: /api/booking/bookings/:id
 */
bookingsRouter.get('/:id', async (req, res) => {
  return sendSuccessResponse(res, {
    data: await bookingService.getBooking(req.userId as string, req.params.id)
  });
});

/**
 * POST: /api/booking/bookings/:id/cancel
 * Cancel and put the seats back on sale.
 */
bookingsRouter.post('/:id/cancel', async (req, res) => {
  return sendSuccessResponse(res, {
    message: 'Booking cancelled.',
    data: await bookingService.cancelBooking(req.userId as string, req.params.id)
  });
});

export { bookingsRouter };
