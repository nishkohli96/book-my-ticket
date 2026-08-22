import { randomUUID } from 'node:crypto';
import type { Response } from 'express';
import { and, eq } from 'drizzle-orm';
import {
  signUpSchema,
  loginSchema,
  oauthSignInSchema,
  type SignUpFormData,
  type UserLoginDetails,
  type OAuthUserDetails
} from '@book-my-ticket/common';
import { postgresDatabase } from '@/db';
import { usersSchema, userIdentitiesSchema } from '@/db/schema';
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

      const newUser = await postgresDatabase.db.transaction(async tx => {
        const [user] = await tx
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

        await tx.insert(userIdentitiesSchema).values({
          id: randomUUID(),
          userId: user.id,
          provider: 'credentials',
        });

        return user;
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
   * Find-or-create for OAuth providers (Google, and Apple later). Checks
   * three cases in order:
   *  1. A user already signed in with this exact provider account before
   *     - matched via the (provider, providerAccountId) identity row.
   *  2. A user with this email already exists via a different provider or
   *     a password - link this new identity to that same user.
   *  3. Neither exists - create both the user and its identity row.
   * There is no password or phone number at this point for a brand new
   * user - those columns stay null until collected via the edit-profile flow.
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

    const { firstName, lastName, email, provider, providerAccountId } = parsedBody.data;

    try {
      const [identity] = await postgresDatabase.db
        .select({ userId: userIdentitiesSchema.userId })
        .from(userIdentitiesSchema)
        .where(
          and(
            eq(userIdentitiesSchema.provider, provider),
            eq(userIdentitiesSchema.providerAccountId, providerAccountId)
          )
        )
        .limit(1);

      const existingUserId = identity?.userId;

      const [existingUser] = existingUserId
        ? await postgresDatabase.db
          .select({
            id: usersSchema.id,
            firstName: usersSchema.firstName,
            lastName: usersSchema.lastName,
            email: usersSchema.email,
            phone: usersSchema.phone,
          })
          .from(usersSchema)
          .where(eq(usersSchema.id, existingUserId))
          .limit(1)
        : await postgresDatabase.db
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
        if (!identity) {
          await postgresDatabase.db.insert(userIdentitiesSchema).values({
            id: randomUUID(),
            userId: existingUser.id,
            provider,
            providerAccountId,
          });
        }

        const userDetails: OAuthUserDetails = {
          id: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          hasPhoneNumber: Boolean(existingUser.phone),
        };
        return sendSuccessResponse(res, { data: userDetails });
      }

      const newUser = await postgresDatabase.db.transaction(async tx => {
        const [user] = await tx
          .insert(usersSchema)
          .values({ id: randomUUID(), firstName, lastName, email })
          .returning({
            id: usersSchema.id,
            firstName: usersSchema.firstName,
            lastName: usersSchema.lastName,
            email: usersSchema.email,
          });

        await tx.insert(userIdentitiesSchema).values({
          id: randomUUID(),
          userId: user.id,
          provider,
          providerAccountId,
        });

        return user;
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
