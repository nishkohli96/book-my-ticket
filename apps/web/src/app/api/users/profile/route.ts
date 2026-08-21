import type { NextRequest } from 'next/server';
import { editProfileSchema, type EditProfileFormData } from '@book-my-ticket/common';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { apiServicesUrl } from '@/constants';
import { apiError, apiSuccess, withErrorHandling } from '@/utils';

export const PATCH = withErrorHandling(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return apiError({ statusCode: 401, message: 'Not authenticated' });
  }

  const body: EditProfileFormData = await request.json();

  const parsedBody = editProfileSchema.safeParse(body);
  if (!parsedBody.success) {
    return apiError({
      statusCode: 400,
      message: 'Invalid profile details',
      error: 'Validation failed',
      validationErrors: parsedBody.error.issues.map(issue => issue.message),
    });
  }

  const response = await fetch(`${apiServicesUrl.user}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': session.user.id,
    },
    body: JSON.stringify(parsedBody.data),
  });

  const data = await response.json();

  if (!response.ok) {
    return apiError({
      statusCode: response.status,
      message: data.message ?? 'Profile update failed',
      error: data.error,
      validationErrors: data.validationErrors,
    });
  }

  return apiSuccess(data.data, {
    statusCode: response.status,
    message: data.message,
  });
});
