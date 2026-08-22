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

export type UserSession = { id: string };
