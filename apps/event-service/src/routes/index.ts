import type { RouteInfo } from '@book-my-ticket/service-kit';
import { eventsRouter } from './events/controller';
import { internalSeatsRouter } from './internal/controller';

/** Public prefix - the only path the gateway forwards to this service. */
export const basePath = '/api/event';

export const routesList: RouteInfo[] = [
  { path: `${basePath}/events`, router: eventsRouter },
  { path: '/internal/seats', router: internalSeatsRouter },
];
