import type { RouteInfo } from '@book-my-ticket/service-kit';
import { bookingsRouter } from './bookings/controller';
import { holdsRouter } from './holds/controller';

/** Public prefix - the only path the gateway forwards to this service. */
export const basePath = '/api/booking';

export const routesList: RouteInfo[] = [
  { path: `${basePath}/holds`, router: holdsRouter },
  { path: `${basePath}/bookings`, router: bookingsRouter },
];
