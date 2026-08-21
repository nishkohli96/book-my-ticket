import { Router, type Response } from 'express';
import { sendErrorResponse } from '@/utils';
import profileService from './service';
import type * as ProfileTypes from './types';

const profileRouter = Router();

/**
 * PATCH: /api/user/profile
 * Update the authenticated user's profile.
 *
 * Trusts the `x-user-id` header, set only by the Next.js BFF after it
 * verifies the caller's NextAuth session - this route is not meant to
 * be called directly by untrusted clients.
 */
profileRouter.patch(
  '/',
  function updateProfile(
    req: ProfileTypes.UpdateProfileRequest,
    res: Response
  ) {
    const userId = req.header('x-user-id');
    if (!userId) {
      return sendErrorResponse(res, {
        statusCode: 401,
        message: 'Missing user identity',
        error: 'x-user-id header is required',
      });
    }
    return profileService.updateProfile(res, userId, req.body);
  }
);

export { profileRouter };
