import { Router, type Response } from 'express';
import { authenticate } from '@/middleware';
import profileService from './service';
import type * as ProfileTypes from './types';

const profileRouter = Router();

profileRouter.use(authenticate);

/**
 * GET: /api/user/profile
 * Fetch the authenticated user's profile.
 */
profileRouter.get(
  '/',
  function getProfile(req: ProfileTypes.GetProfileRequest, res: Response) {
    return profileService.getProfile(res, req.userId);
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
    return profileService.updateProfile(res, req.userId, req.body);
  }
);

export { profileRouter };
