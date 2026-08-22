import type {
	SignUpFormData,
	LoginFormData,
	OAuthSignInData
} from '@book-my-ticket/common';
import { type Request } from 'express';

export type UserSignupRequest = Request<object, object, SignUpFormData>;

export type UserLoginRequest = Request<object, object, LoginFormData>;

export type OAuthSignInRequest = Request<object, object, OAuthSignInData>;
