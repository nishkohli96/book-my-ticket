import { randomBytes, createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { ENV_CONFIG } from '@/constants';

export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ENV_CONFIG.jwt.secret, {
    expiresIn: ENV_CONFIG.jwt.accessTokenExpiry as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, ENV_CONFIG.jwt.secret) as AccessTokenPayload;
  } catch {
    return null;
  }
}

/** High-entropy opaque token - not a JWT, just a random secret to look up in the sessions table. */
export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

/**
 * Refresh tokens are high-entropy random strings, not low-entropy secrets
 * like passwords - a fast SHA-256 hash (not bcrypt) is sufficient so a DB
 * leak doesn't hand out directly usable refresh tokens.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
