import { type Request } from 'express';

export interface UserLoginBody {
  email: string;
  password: string;
}

export type UserLoginRequest = Request<object, object, UserLoginBody>;

export interface UserSignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type UserSignupRequest = Request<object, object, UserSignupBody>;
