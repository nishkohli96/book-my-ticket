import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, sendErrorResponse } from '@/utils';

/**
 * Verifies the `Authorization: Bearer <accessToken>` header against the
 * signed JWT itself - no DB lookup per request, since the access token is
 * short-lived by design. Replaces the old blind `x-user-id` header trust.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  const payload = token ? verifyAccessToken(token) : null;
  if (!payload) {
    return sendErrorResponse(res, {
      statusCode: 401,
      message: 'Invalid or expired access token',
      error: 'Authentication failed',
    });
  }

  req.userId = payload.userId;
  next();
}
