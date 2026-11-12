import 'dotenv/config';
import { createApp, startServer } from '@book-my-ticket/service-kit';
import { ENV_CONFIG } from '@/constants';
import { postgresDatabase } from '@/db';
import { basePath, routesList } from '@/routes';

void startServer({
  app: createApp({
    basePath,
    routes: routesList,
    corsOrigin: ENV_CONFIG.corsOrigin
  }),
  port: ENV_CONFIG.port,
  onStart: () => postgresDatabase.connect(),
  onStop: () => postgresDatabase.disconnect(),
});
