import { Router } from 'express';
import { eventListQuerySchema } from '@book-my-ticket/common';
import { HttpError, sendSuccessResponse } from '@book-my-ticket/service-kit';
import eventService from './service';

const eventsRouter = Router();

/**
 * GET: /api/event/events?category=&city=&q=&page=&limit=
 * Upcoming, on-sale events, soonest first.
 */
eventsRouter.get('/', async (req, res) => {
  const query = eventListQuerySchema.safeParse(req.query);
  if (!query.success) {
    throw new HttpError(
      400,
      'Invalid filters',
      query.error.issues.map(issue => issue.message)
    );
  }
  return sendSuccessResponse(res, { data: await eventService.listEvents(query.data) });
});

/**
 * GET: /api/event/events/cities
 * Registered before "/:slug" so "cities" isn't read as a slug.
 */
eventsRouter.get('/cities', async (_req, res) => {
  return sendSuccessResponse(res, { data: await eventService.listCities() });
});

/**
 * GET: /api/event/events/:slug
 */
eventsRouter.get('/:slug', async (req, res) => {
  return sendSuccessResponse(res, { data: await eventService.getEventBySlug(req.params.slug) });
});

/**
 * GET: /api/event/events/:eventId/seats
 * Every seat with its live status - the seat map polls this.
 */
eventsRouter.get('/:eventId/seats', async (req, res) => {
  return sendSuccessResponse(res, { data: await eventService.listSeats(req.params.eventId) });
});

export { eventsRouter };
