import { randomUUID } from 'node:crypto';
import type { Response } from 'express';
import { and, eq, isNull } from 'drizzle-orm';
import type { UserSession } from '@book-my-ticket/common';
import { postgresDatabase } from '@/db';
import { userSessionsSchema } from '@/db/schema';
import { sendSuccessResponse, sendErrorResponse } from '@/utils';

class SessionService {
  /**
   * Single active session per user - a fresh sign-in revokes every prior
   * row for that userId before inserting the new one, so an older signed-in
   * device stops being treated as valid the next time its token is checked.
   */
  async createSession(res: Response, userId: string) {
    try {
      const session = await postgresDatabase.db.transaction(async tx => {
        await tx
          .update(userSessionsSchema)
          .set({ revokedAt: new Date() })
          .where(and(eq(userSessionsSchema.userId, userId), isNull(userSessionsSchema.revokedAt)));

        const [newSession] = await tx
          .insert(userSessionsSchema)
          .values({ id: randomUUID(), userId })
          .returning({ id: userSessionsSchema.id });

        return newSession;
      });

      const userSession: UserSession = session;

      return sendSuccessResponse(res, { statusCode: 201, data: userSession });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }

  async isSessionActive(res: Response, sessionId: string) {
    try {
      const [session] = await postgresDatabase.db
        .select({ revokedAt: userSessionsSchema.revokedAt })
        .from(userSessionsSchema)
        .where(eq(userSessionsSchema.id, sessionId))
        .limit(1);

      return sendSuccessResponse(res, {
        data: { active: Boolean(session) && session.revokedAt === null },
      });
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
