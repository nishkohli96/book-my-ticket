import { randomUUID } from 'node:crypto';
import type { Response } from 'express';
import { eq } from 'drizzle-orm';
import {
  signUpSchema,
  loginSchema,
  type SignUpFormData
} from '@book-my-ticket/common';
import { postgresDatabase } from '@/db';
import { usersSchema } from '@/db/schema';
import {
  hashPassword,
  comparePassword,
  sendSuccessResponse,
  sendErrorResponse
} from '@/utils';

class AuthService {
  async signupUser(res: Response, body: SignUpFormData) {
    const parsedBody = signUpSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendErrorResponse(res, {
        statusCode: 400,
        message: 'Invalid signup details',
        error: 'Validation failed',
        validationErrors: parsedBody.error.issues.map(issue => issue.message),
      });
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password
    } = parsedBody.data;

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
          phone: phoneNumber.phone,
          phoneCountry: phoneNumber.country,
          phoneDialCode: phoneNumber.dialCode,
          phoneNo: phoneNumber.phoneNo,
          passwordHash,
        })
        .returning({
          id: usersSchema.id,
          name: usersSchema.name,
          email: usersSchema.email,
          phone: usersSchema.phone,
          phoneCountry: usersSchema.phoneCountry,
          phoneDialCode: usersSchema.phoneDialCode,
          phoneNo: usersSchema.phoneNo,
        });

      /**
       * 201 Created is the correct convention for an endpoint that
       * creates a new resource.
       */
      return sendSuccessResponse(res, {
        statusCode: 201,
        message: 'User successfully registered.',
        data: newUser
      });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }

  async loginUser(res: Response, body: unknown) {
    const parsedBody = loginSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendErrorResponse(res, {
        statusCode: 400,
        message: 'Invalid login details',
        error: 'Validation failed',
        validationErrors: parsedBody.error.issues.map(issue => issue.message),
      });
    }

    const { email, password } = parsedBody.data;

    try {
      /**
       * db.select().limit(1) returns an array — [user] destructures the first row;
       * if no match, array is empty.
       */
      const [user] = await postgresDatabase.db
        .select({
          id: usersSchema.id,
          name: usersSchema.name,
          email: usersSchema.email,
          passwordHash: usersSchema.passwordHash,
        })
        .from(usersSchema)
        .where(eq(usersSchema.email, email))
        .limit(1);

      /**
       * Distinguishing "user doesn't exist" vs "wrong password" is a classic user-enumeration
       * vulnerability. It lets attackers brute-force which emails are registered.
       */
      if (!user?.passwordHash || !(await comparePassword(password, user.passwordHash))) {
        return sendErrorResponse(res, {
          statusCode: 401,
          message: 'Invalid email or password',
          error: 'Authentication failed',
        });
      }

      return sendSuccessResponse(res, {
        message: 'Login successful.',
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        },
      });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }
}

const authService = new AuthService();
export default authService;
