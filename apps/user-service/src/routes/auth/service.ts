import { randomUUID } from 'node:crypto';
import type { Response } from 'express';
import { eq } from 'drizzle-orm';
import {
  signUpSchema,
  loginSchema,
  oauthSignInSchema,
  type SignUpFormData,
  type UserLoginDetails,
  type OAuthUserDetails
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
          firstName,
          lastName,
          email,
          phone: phoneNumber.phone,
          phoneCountry: phoneNumber.country,
          phoneDialCode: phoneNumber.dialCode,
          phoneNo: phoneNumber.phoneNo,
          passwordHash,
        })
        .returning({
          id: usersSchema.id,
          firstName: usersSchema.firstName,
          lastName: usersSchema.lastName,
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
          firstName: usersSchema.firstName,
          lastName: usersSchema.lastName,
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

      const loginDetails: UserLoginDetails = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };

      return sendSuccessResponse(res, {
        message: 'Login successful.',
        data: loginDetails,
      });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }

  /**
   * Find-or-create for OAuth providers (Google). There is no password or
   * phone number at this point - an existing row is returned as-is, a new
   * one is inserted with those columns left null.
   */
  async findOrCreateOAuthUser(res: Response, body: unknown) {
    const parsedBody = oauthSignInSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendErrorResponse(res, {
        statusCode: 400,
        message: 'Invalid sign-in details',
        error: 'Validation failed',
        validationErrors: parsedBody.error.issues.map(issue => issue.message),
      });
    }

    const { firstName, lastName, email } = parsedBody.data;

    try {
      const [existingUser] = await postgresDatabase.db
        .select({
          id: usersSchema.id,
          firstName: usersSchema.firstName,
          lastName: usersSchema.lastName,
          email: usersSchema.email,
          phone: usersSchema.phone,
        })
        .from(usersSchema)
        .where(eq(usersSchema.email, email))
        .limit(1);

      if (existingUser) {
        const userDetails: OAuthUserDetails = {
          id: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          hasPhoneNumber: Boolean(existingUser.phone),
        };
        return sendSuccessResponse(res, { data: userDetails });
      }

      const [newUser] = await postgresDatabase.db
        .insert(usersSchema)
        .values({ id: randomUUID(), firstName, lastName, email })
        .returning({
          id: usersSchema.id,
          firstName: usersSchema.firstName,
          lastName: usersSchema.lastName,
          email: usersSchema.email,
        });

      const userDetails: OAuthUserDetails = { ...newUser, hasPhoneNumber: false };

      return sendSuccessResponse(res, {
        statusCode: 201,
        data: userDetails,
      });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }
}

const authService = new AuthService();
export default authService;
