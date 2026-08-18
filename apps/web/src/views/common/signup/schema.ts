import { z } from 'zod';
import { emailPattern } from '@/constants/regex';

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1).max(30),
  lastName: z.string().trim().min(1).max(30),
  email: z.string().trim().regex(emailPattern, { message: 'Invalid email address' }),
  password: z.string().min(8).max(20),
  agreeTnC: z.literal(true)
});

export type SignUpFormSchema = z.infer<typeof signUpSchema>;
