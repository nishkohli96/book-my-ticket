import { randomUUID } from 'node:crypto';
import type { Response } from 'express';
import { eq } from 'drizzle-orm';
import { signUpSchema } from '@book-my-ticket/common';
import { postgresDatabase } from '@/db';
import { usersSchema } from '@/db/schema';
import { hashPassword, sendErrorResponse } from '@/utils';
import type { UserSignupBody } from './types';

class AuthService {
  async signupUser(res: Response, body: UserSignupBody) {
    const parsedBody = signUpSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendErrorResponse(res, {
        statusCode: 400,
        message: 'Invalid signup details',
        error: parsedBody.error.issues.map(issue => issue.message).join(', '),
      });
    }

    const { firstName, lastName, email, password } = parsedBody.data;

    try {
      /* Check if user already exists */
      const [existingUser] = await postgresDatabase.db
        .select({ id: usersSchema.id })
        .from(usersSchema)
        .where(eq(usersSchema.email, email))
        .limit(1);

      if (existingUser) {
        return sendErrorResponse(res, {
          statusCode: 409,
          message: 'An account with this email already exists',
          error: 'Email already registered',
        });
      }

      const passwordHash = await hashPassword(password);

      const [newUser] = await postgresDatabase.db
        .insert(usersSchema)
        .values({
          id: randomUUID(),
          name: `${firstName} ${lastName}`.trim(),
          email,
          passwordHash,
        })
        .returning({
          id: usersSchema.id,
          name: usersSchema.name,
          email: usersSchema.email,
        });

      return res.status(201).json({
        success: true,
        user: newUser,
      });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }

  loginUser(res: Response, email: string, password: string) {
    try {
      return res
        .status(200)
        .send({
          email,
          password
        })
        .end();
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }
}

const authService = new AuthService();
export default authService;
