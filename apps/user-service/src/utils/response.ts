import type { Response } from 'express';
import { isProductionEnv } from '@/constants';
import { winstonLogger } from '@/middleware';
import { printObject } from './printObject';

type ErrorResponseOptions = {
  error: unknown;
  message?: string;
  statusCode?: number;
};

function stringifyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return printObject(error);
}

export function sendErrorResponse(
  res: Response,
  {
    error,
    message = 'Internal Server Error',
    statusCode = 500,
  }: ErrorResponseOptions
) {
  const errorMessage = stringifyError(error);

  winstonLogger.error(`⚠ ERROR - ${errorMessage}`);
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    /**
     * Full error detail is only useful for debugging,
     * never leak it to clients in production.
     */
    ...(isProductionEnv ? {} : { error: errorMessage }),
  });
}
