import express, { type Response } from 'express';
import cors from 'cors';
import type { UserDetails } from '@book-my-ticket/types';
import { ENV_CONFIG } from '@/constants';
import { requestLogger } from '@/middleware';
import { routesList } from '@/routes';
import { sendErrorResponse } from '@/utils';

const app = express();

type HealthResponse = {
  env: string;
  message: string;
  exampleUser?: UserDetails;
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger);

app.get('/', (_, response: Response<HealthResponse>) => {
  const user: UserDetails = {
    name: 'Test user pollym12',
    email: 'usw@example.com'
  };
  response.status(200).json({
    env: ENV_CONFIG.env,
    message: 'Api is up & running!!!',
    exampleUser: user
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

export default app;
