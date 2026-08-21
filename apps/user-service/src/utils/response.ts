import type { Response } from 'express';
import { isProductionEnv } from '@/constants';
import { winstonLogger } from '@/middleware';
import { type SuccessResponseOptions, type ErrorResponseOptions } from '@/types';
import { printObject } from './printObject';

export function sendSuccessResponse(
  res: Response,
  {
    statusCode = 200,
    message = 'Success',
    data,
  }: SuccessResponseOptions
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
  if (typeof error === 'string') {
    return error;
  }
  return printObject(error);
}

export function sendErrorResponse(
  res: Response,
  {
    statusCode = 500,
    message = 'Internal Server Error',
    data = null,
    error,
    validationErrors,
  }: ErrorResponseOptions
) {
  const errorMessage = stringifyError(error);

  winstonLogger.error(`⚠ ERROR - ${errorMessage}`);
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    data,
    /**
     * Full error detail is only useful for debugging,
     * never leak it to clients in production.
     */
    ...(isProductionEnv ? {} : { error: errorMessage }),
    ...(validationErrors ? { validationErrors } : {}),
  });
}
