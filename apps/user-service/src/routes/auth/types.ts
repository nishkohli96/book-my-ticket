import type { SignUpFormData, LoginFormData } from '@book-my-ticket/common';
import { type Request } from 'express';

export type UserSignupRequest = Request<object, object, SignUpFormData>;

export type UserLoginRequest = Request<object, object, LoginFormData>;
