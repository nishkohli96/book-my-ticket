import { loginSchema, type LoginFormData } from './login';
import {
  userValidation,
  signUpSchema,
  type SignUpFormData
} from './signup';

export {
  userValidation,
  signUpSchema,
  loginSchema
};

export type {
  SignUpFormData,
  LoginFormData
};
