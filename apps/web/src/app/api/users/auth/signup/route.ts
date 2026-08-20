import type { NextRequest } from 'next/server';
import { signUpSchema } from '@book-my-ticket/common';
import { apiError, apiSuccess, withErrorHandling } from '@/lib/api-response';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL ?? 'http://localhost:8001';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body: unknown = await request.json();

  /**
   * `request.json()` returns `unknown` - there is no way to generically
   * type a Route Handler's body. Running it through the same zod schema
   * the form uses is what actually gives `parsedBody.data` a real,
   * validated `SignUpFormData` type.
   */
  const parsedBody = signUpSchema.safeParse(body);
  if (!parsedBody.success) {
    return apiError({
      statusCode: 400,
      message: 'Invalid signup details',
      error: 'Validation failed',
      validationErrors: parsedBody.error.issues.map(issue => issue.message),
    });
  }

  const response = await fetch(`${USER_SERVICE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedBody.data),
  });

  const data = await response.json();

  if (!response.ok) {
    return apiError({
      statusCode: response.status,
      message: data.message ?? 'Signup failed',
      error: data.error,
      validationErrors: data.validationErrors,
    });
  }

  return apiSuccess(data.data, {
    statusCode: response.status,
    message: data.message,
  });
});
