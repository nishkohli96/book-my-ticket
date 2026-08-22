import { type Request } from 'express';

export type CreateSessionRequest = Request<object, object, { userId: string }>;
