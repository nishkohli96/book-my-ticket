import cors from 'cors';
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
  type Router
} from 'express';
import { requestLogger } from './logger';
import { HttpError, sendErrorResponse } from './response';

export type RouteInfo = {
  path: string;
  router: Router;
};

type CreateAppOptions = {
  /** Public prefix the gateway routes to this service, e.g. "/api/event". */
  basePath: string;
  routes: RouteInfo[];
  corsOrigin: string;
};

/** Express app with the middleware, health route, 404 and error handler every service shares. */
export function createApp({ basePath, routes, corsOrigin }: CreateAppOptions): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: corsOrigin }));
  app.use(requestLogger);

  app.get(`${basePath}/health`, (_, res) => {
    res.status(200).json({
      env: process.env.NODE_ENV ?? 'development',
      message: 'Api is up & running!!!'
    });
  });

  routes.forEach(route => app.use(route.path, route.router));

  app.use((req, res) => sendErrorResponse(res, {
    statusCode: 404,
    message: '404 - Not Found',
    error: `No route exists for this endpoint: "${req.originalUrl}"`
  }));

  /* Must keep all 4 params so Express treats it as the error handler. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      return sendErrorResponse(res, {
        statusCode: err.statusCode,
        message: err.message,
        error: err.message,
        validationErrors: err.validationErrors
      });
    }
    return sendErrorResponse(res, { error: err });
  });

  return app;
}
