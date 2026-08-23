import { randomUUID } from 'node:crypto';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { and, eq, gt, isNull } from 'drizzle-orm';
import type { UserSession } from '@book-my-ticket/common';
import { ENV_CONFIG } from '@/constants';
import { postgresDatabase } from '@/db';
import { userSessionsSchema } from '@/db/schema';
import {
  sendSuccessResponse,
  sendErrorResponse,
  signAccessToken,
  generateRefreshToken,
  hashToken
} from '@/utils';

function refreshTokenExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ENV_CONFIG.jwt.refreshTokenExpiryDays);
  return expiresAt;
}

function buildTokenPair(
  userId: string,
  sessionId: string
): Omit<UserSession, 'refreshToken'> & { refreshToken: string; refreshTokenHash: string } {
  const accessToken = signAccessToken({ userId, sessionId });
  const { exp } = jwt.decode(accessToken) as { exp: number };
  const refreshToken = generateRefreshToken();

  return {
    sessionId,
    accessToken,
    accessTokenExpiresAt: exp * 1000,
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
  };
}

class SessionService {
  /**
   * Single active session per user - a fresh sign-in revokes every prior
   * row for that userId before inserting the new one, so an older signed-in
   * device stops being treated as valid the next time its refresh token is used.
   */
  async createSession(res: Response, userId: string) {
    try {
      const sessionId = randomUUID();
      const tokens = buildTokenPair(userId, sessionId);

      await postgresDatabase.db.transaction(async tx => {
        await tx
          .update(userSessionsSchema)
          .set({ revokedAt: new Date() })
          .where(and(eq(userSessionsSchema.userId, userId), isNull(userSessionsSchema.revokedAt)));

        await tx.insert(userSessionsSchema).values({
          id: sessionId,
          userId,
          refreshTokenHash: tokens.refreshTokenHash,
          refreshTokenExpiresAt: refreshTokenExpiry(),
        });
      });

      const userSession: UserSession = {
        sessionId: tokens.sessionId,
        accessToken: tokens.accessToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshToken: tokens.refreshToken,
      };

      return sendSuccessResponse(res, { statusCode: 201, data: userSession });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }

  /**
   * Rotation: a used refresh token is immediately revoked and replaced by
   * a new one on every refresh, alongside a fresh access token. Limits how
   * long a leaked refresh token stays useful, and a reused (already-
   * rotated) token simply fails to match any active row.
   */
  async refreshSession(res: Response, refreshToken: string) {
    try {
      const refreshTokenHash = hashToken(refreshToken);

      const [session] = await postgresDatabase.db
        .select({ id: userSessionsSchema.id, userId: userSessionsSchema.userId })
        .from(userSessionsSchema)
        .where(
          and(
            eq(userSessionsSchema.refreshTokenHash, refreshTokenHash),
            isNull(userSessionsSchema.revokedAt),
            gt(userSessionsSchema.refreshTokenExpiresAt, new Date())
          )
        )
        .limit(1);

      if (!session) {
        return sendErrorResponse(res, {
          statusCode: 401,
          message: 'Invalid or expired refresh token',
          error: 'Refresh failed',
        });
      }

      const newSessionId = randomUUID();
      const tokens = buildTokenPair(session.userId, newSessionId);

      await postgresDatabase.db.transaction(async tx => {
        await tx
          .update(userSessionsSchema)
          .set({ revokedAt: new Date() })
          .where(eq(userSessionsSchema.id, session.id));

        await tx.insert(userSessionsSchema).values({
          id: newSessionId,
          userId: session.userId,
          refreshTokenHash: tokens.refreshTokenHash,
          refreshTokenExpiresAt: refreshTokenExpiry(),
        });
      });

      const userSession: UserSession = {
        sessionId: tokens.sessionId,
        accessToken: tokens.accessToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshToken: tokens.refreshToken,
      };

      return sendSuccessResponse(res, { data: userSession });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }

  async revokeSession(res: Response, sessionId: string) {
    try {
      await postgresDatabase.db
        .update(userSessionsSchema)
        .set({ revokedAt: new Date() })
        .where(eq(userSessionsSchema.id, sessionId));

      return sendSuccessResponse(res, { message: 'Session revoked.' });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }
}

const sessionService = new SessionService();
export default sessionService;
