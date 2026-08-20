import type { NextRequest } from 'next/server';
import { loginSchema } from '@book-my-ticket/common';
import { apiError, apiSuccess, withErrorHandling } from '@/lib/api-response';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL ?? 'http://localhost:8000';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body: unknown = await request.json();

  const parsedBody = loginSchema.safeParse(body);
  if (!parsedBody.success) {
    return apiError({
      statusCode: 400,
      message: 'Invalid login details',
      error: 'Validation failed',
      validationErrors: parsedBody.error.issues.map(issue => issue.message),
    });
  }

  const response = await fetch(`${USER_SERVICE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedBody.data),
  });

  const data = await response.json();

  if (!response.ok) {
    return apiError({
      statusCode: response.status,
      message: data.message ?? 'Login failed',
      error: data.error,
      validationErrors: data.validationErrors,
    });
  }

  return apiSuccess(data.data, {
    statusCode: response.status,
    message: data.message,
  });
});
