import { Router, type Request, type Response } from 'express';
import { sendErrorResponse } from '@/utils';
import profileService from './service';
import type * as ProfileTypes from './types';

const profileRouter = Router();

/**
 * Both routes trust the `x-user-id` header, set only by the Next.js BFF
 * after it verifies the caller's NextAuth session - neither is meant to
 * be called directly by untrusted clients.
 */
function requireUserId(req: Pick<Request, 'header'>, res: Response): string | undefined {
  const userId = req.header('x-user-id');
  if (!userId) {
    sendErrorResponse(res, {
      statusCode: 401,
      message: 'Missing user identity',
      error: 'x-user-id header is required',
    });
  }
  return userId;
}

/**
 * GET: /api/user/profile
 * Fetch the authenticated user's profile.
 */
profileRouter.get(
  '/',
  function getProfile(req: Request, res: Response) {
    const userId = requireUserId(req, res);
    if (!userId) {
      return;
    }
    return profileService.getProfile(res, userId);
  }
);

/**
 * PATCH: /api/user/profile
 * Update the authenticated user's profile.
 */
profileRouter.patch(
  '/',
  function updateProfile(
    req: ProfileTypes.UpdateProfileRequest,
    res: Response
  ) {
    const userId = requireUserId(req, res);
    if (!userId) {
      return;
    }
    return profileService.updateProfile(res, userId, req.body);
  }
);

export { profileRouter };
