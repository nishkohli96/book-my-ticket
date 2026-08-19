import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import { ENV_CONFIG } from '@/constants';
import { requestLogger } from '@/middleware';
import { routesList } from '@/routes';
import { sendErrorResponse } from '@/utils';

const app = express();

type HealthResponse = {
  env: string;
  message: string;
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ENV_CONFIG.corsOrigin,
  })
);
app.use(requestLogger);

app.get('/', (_, response: Response<HealthResponse>) => {
  response.status(200).json({
    env: ENV_CONFIG.env,
    message: 'Api is up & running!!!',
  });
});

routesList.forEach(route => app.use(route.path, route.router));

/* 404 Handler - To be written at last */
app.use((req, res) => {
  const notFoundError = `No route exists for this endpoint: "${req.originalUrl}"`;
  return sendErrorResponse(res, {
    statusCode: 404,
    message: '404 - Not Found',
    error: notFoundError,
  });
});

/**
 * Global error handler - must be registered last, and must keep all 4
 * params (req/res/next unused) so Express recognizes it as an error
 * handler. Catches anything passed to next(err), including rejected
 * promises returned from async route handlers in Express 5.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  return sendErrorResponse(res, { error: err });
});

export default app;
