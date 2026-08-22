import { Router, type Response } from 'express';
import sessionService from './service';
import type * as SessionTypes from './types';

const sessionRouter = Router();

/**
 * POST: /api/user/sessions
 * Create a new session for a user, revoking any prior active session -
 * single-active-session enforcement (see service for detail).
 *
 * Called only by the Next.js BFF right after it has verified a sign-in
 * (Credentials or OAuth) - same trust boundary as the `x-user-id` header
 * used on the profile routes.
 */
sessionRouter.post(
  '/',
  function createSession(
    req: SessionTypes.CreateSessionRequest,
    res: Response
  ) {
    return sessionService.createSession(res, req.body.userId);
  }
);

/**
 * GET: /api/user/sessions/:id
 * Check whether a session is still active (not superseded by a newer sign-in).
 */
sessionRouter.get(
  '/:id',
  function getSessionStatus(req, res: Response) {
    return sessionService.isSessionActive(res, req.params.id);
  }
);

/**
 * DELETE: /api/user/sessions/:id
 * Explicit logout - revoke a session immediately.
 */
sessionRouter.delete(
  '/:id',
  function deleteSession(req, res: Response) {
    return sessionService.revokeSession(res, req.params.id);
  }
);

export { sessionRouter };
