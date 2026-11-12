import type { z } from 'zod';
import { HttpError } from '@book-my-ticket/service-kit';

export function parseBody<T>(schema: z.ZodType<T>, body: unknown, message: string): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError(400, message, parsed.error.issues.map(issue => issue.message));
  }
  return parsed.data;
}
