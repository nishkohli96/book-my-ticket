import { z } from 'zod';
import { emailPattern } from '@/constants/regex';

export const loginSchema = z.object({
  email: z.string().trim().regex(emailPattern, { message: 'Invalid email address' }),
  password: z.string().min(8).max(72)
});

export type LoginFormValues = z.infer<typeof loginSchema>;
