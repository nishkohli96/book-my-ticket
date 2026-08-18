import { type z } from 'zod';
import { signUpSchema } from '../signup/schema';

export const loginSchema = signUpSchema.pick({
  email: true,
  password: true
});

export type LoginFormData = z.infer<typeof loginSchema>;
