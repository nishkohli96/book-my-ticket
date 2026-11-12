import type { Response } from 'express';
import { logger } from './logger';

export type SuccessResponseOptions = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

export type ErrorResponseOptions = {
  statusCode?: number;
  message?: string;
  error: unknown;
  /** Per-field/issue validation messages, shown to the client regardless of env. */
  validationErrors?: string[];
};

export function sendSuccessResponse(
  res: Response,
  { statusCode = 200, message = 'Success', data }: SuccessResponseOptions
) {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data
  });
}

function stringifyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === 'string' ? error : JSON.stringify(error, null, 2);
}

export function sendErrorResponse(
  res: Response,
  {
    statusCode = 500,
    message = 'Internal Server Error',
    error,
    validationErrors
  }: ErrorResponseOptions
) {
  const errorMessage = stringifyError(error);
  logger.error(`⚠ ERROR - ${errorMessage}`);
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    /* Full error detail is for debugging only - never leak it in production. */
    ...(process.env.NODE_ENV === 'production' ? {} : { error: errorMessage }),
    ...(validationErrors ? { validationErrors } : {})
  });
}

/**
 * Throw from a service/handler to answer with a specific status. Express 5
 * forwards errors thrown in async handlers to the app's error handler,
 * which turns this into the standard error response.
 */
export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly validationErrors?: string[]
  ) {
    super(message);
  }
}
