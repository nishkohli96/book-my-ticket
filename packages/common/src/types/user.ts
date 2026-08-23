import type { SignUpFormData, EditProfileFormData } from '@/validations';

export type UserLoginDetails = Pick<
  SignUpFormData,
  'email' | 'firstName' | 'lastName'
> & { id: string };

export type UserProfileDetails = EditProfileFormData & { id: string };

export type OAuthUserDetails = UserLoginDetails & {
  hasPhoneNumber: boolean;
  avatar: string | null;
};

export type UserSession = {
  sessionId: string;
  accessToken: string;
  /** Short-lived access token's own expiry, as an epoch ms timestamp. */
  accessTokenExpiresAt: number;
  refreshToken: string;
};
