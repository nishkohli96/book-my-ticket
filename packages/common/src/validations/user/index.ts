import { loginSchema, type LoginFormData } from './login';
import {
  userValidation,
  signUpSchema,
  editProfileSchema,
  oauthSignInSchema,
  oauthProviders,
  type SignUpFormData,
  type EditProfileFormData,
  type OAuthSignInData
} from './signup';

export {
  userValidation,
  signUpSchema,
  editProfileSchema,
  oauthSignInSchema,
  oauthProviders,
  loginSchema
};

export type {
  SignUpFormData,
  EditProfileFormData,
  OAuthSignInData,
  LoginFormData
};
