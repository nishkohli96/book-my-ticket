import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendErrorResponse } from './response';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Only set on routes behind the `authenticate` middleware. */
      userId?: string;
    }
  }
}

export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

/** Every service verifies the access token user-service signs, using the shared JWT_SECRET. */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }
  try {
    return jwt.verify(token, secret) as AccessTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verifies `Authorization: Bearer <accessToken>` by signature and expiry
 * only - no DB lookup, the access token is short-lived by design.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const payload = token ? verifyAccessToken(token) : null;
  if (!payload) {
    return sendErrorResponse(res, {
      statusCode: 401,
      message: 'Invalid or expired access token',
      error: 'Authentication failed'
    });
  }
  req.userId = payload.userId;
  next();
}
