import { type Request } from 'express';

export type CreateSessionRequest = Request<object, object, { userId: string }>;

export type RefreshSessionRequest = Request<object, object, { refreshToken: string }>;
