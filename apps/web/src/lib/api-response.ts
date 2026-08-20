import { NextResponse, type NextRequest } from 'next/server';

/**
 * Response shape mirrors the backend's sendSuccessResponse/sendErrorResponse
 * (apps/user-service/src/utils/response.ts) so API consumers see one
 * consistent contract regardless of which layer produced the response.
 */
type ApiErrorOptions = {
  message: string;
  statusCode?: number;
  error?: string;
  validationErrors?: string[];
};

export function apiError({
  message,
  statusCode = 500,
  error,
  validationErrors,
}: ApiErrorOptions) {
  return NextResponse.json(
    {
      success: false,
      status: statusCode,
      message,
      ...(error ? { error } : {}),
      ...(validationErrors ? { validationErrors } : {}),
    },
    { status: statusCode }
  );
}

type ApiSuccessOptions = {
  message?: string;
  statusCode?: number;
};

export function apiSuccess<T>(
  data: T,
  { message = 'Success', statusCode = 200 }: ApiSuccessOptions = {}
) {
  return NextResponse.json(
    { success: true, status: statusCode, message, data },
    { status: statusCode }
  );
}

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * Wraps a route handler so any thrown/rejected error (JSON parse failure,
 * network error calling a backend service, etc.) is turned into the same
 * apiError shape instead of leaking a raw 500 HTML page or an unhandled
 * exception. Every route.ts's exported method should be wrapped in this.
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async request => {
    try {
      return await handler(request);
    } catch (error) {
      return apiError({
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
