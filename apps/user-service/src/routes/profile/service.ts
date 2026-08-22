import type { Response } from 'express';
import { and, eq, ne } from 'drizzle-orm';
import {
  editProfileSchema,
  type EditProfileFormData,
  type UserProfileDetails
} from '@book-my-ticket/common';
import { postgresDatabase } from '@/db';
import { usersSchema } from '@/db/schema';
import { sendSuccessResponse, sendErrorResponse } from '@/utils';

class ProfileService {
  async getProfile(res: Response, userId: string) {
    try {
      const [user] = await postgresDatabase.db
        .select({
          id: usersSchema.id,
          firstName: usersSchema.firstName,
          lastName: usersSchema.lastName,
          email: usersSchema.email,
          phoneNumber: {
            phone: usersSchema.phone,
            country: usersSchema.phoneCountry,
            dialCode: usersSchema.phoneDialCode,
            phoneNo: usersSchema.phoneNo,
          }
        })
        .from(usersSchema)
        .where(eq(usersSchema.id, userId))
        .limit(1);

      if (!user) {
        return sendErrorResponse(res, {
          statusCode: 404,
          message: 'User not found',
          error: 'No user with this id',
        });
      }

      const profileDetails: UserProfileDetails = {
        ...user,
        phoneNumber: {
          phone: user.phoneNumber.phone ?? '',
          country: user.phoneNumber.country ?? '',
          dialCode: user.phoneNumber.dialCode ?? '',
          phoneNo: user.phoneNumber.phoneNo ?? '',
        },
      };
      return sendSuccessResponse(res, { data: profileDetails });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }

  async updateProfile(
    res: Response,
    userId: string,
    body: EditProfileFormData
  ) {
    const parsedBody = editProfileSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendErrorResponse(res, {
        statusCode: 400,
        message: 'Invalid profile details',
        error: 'Validation failed',
        validationErrors: parsedBody.error.issues.map(issue => issue.message),
      });
    }

    const { firstName, lastName, email, phoneNumber } = parsedBody.data;

    try {
      const [emailOwner] = await postgresDatabase.db
        .select({ id: usersSchema.id })
        .from(usersSchema)
        .where(and(eq(usersSchema.email, email), ne(usersSchema.id, userId)))
        .limit(1);

      if (emailOwner) {
        return sendErrorResponse(res, {
          statusCode: 409,
          message: 'An account with this email already exists',
          error: 'Email already registered',
        });
      }

      const [updatedUser] = await postgresDatabase.db
        .update(usersSchema)
        .set({
          firstName,
          lastName,
          email,
          phone: phoneNumber.phone,
          phoneCountry: phoneNumber.country,
          phoneDialCode: phoneNumber.dialCode,
          phoneNo: phoneNumber.phoneNo,
        })
        .where(eq(usersSchema.id, userId))
        .returning({
          id: usersSchema.id,
          firstName: usersSchema.firstName,
          lastName: usersSchema.lastName,
          email: usersSchema.email,
          phoneNumber: {
            phone: usersSchema.phone,
            country: usersSchema.phoneCountry,
            dialCode: usersSchema.phoneDialCode,
            phoneNo: usersSchema.phoneNo,
          }
        });

      if (!updatedUser) {
        return sendErrorResponse(res, {
          statusCode: 404,
          message: 'User not found',
          error: 'No user with this id',
        });
      }

      const profileDetails: UserProfileDetails = {
        ...updatedUser,
        phoneNumber: {
          phone: updatedUser.phoneNumber.phone ?? '',
          country: updatedUser.phoneNumber.country ?? '',
          dialCode: updatedUser.phoneNumber.dialCode ?? '',
          phoneNo: updatedUser.phoneNumber.phoneNo ?? '',
        },
      };

      return sendSuccessResponse(res, {
        message: 'Profile updated successfully.',
        data: profileDetails,
      });
    } catch (error) {
      return sendErrorResponse(res, { error });
    }
  }
}

const profileService = new ProfileService();
export default profileService;
