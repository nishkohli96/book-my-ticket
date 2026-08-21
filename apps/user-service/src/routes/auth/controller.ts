import { Router, type Response } from 'express';
import authService from './service';
import type * as AuthTypes from './types';

const authRouter = Router();

/**
 * POST: /api/auth/signup
 * Register a new user
 */
authRouter.post(
  '/signup',
  function signupUser(
    req: AuthTypes.UserSignupRequest,
    res: Response
  ) {
    return authService.signupUser(res, req.body);
  }
);

/**
 * POST: /api/auth/signup
 * Login existing user
 */
authRouter.post(
  '/login',
  function loginUser(
    req: AuthTypes.UserLoginRequest,
    res: Response
  ) {
    return authService.loginUser(res, req.body);
  }
);

export { authRouter };
