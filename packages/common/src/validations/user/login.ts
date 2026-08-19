/**
 * You can also pick certain fields from an existing schema.
 * export const loginSchema = signUpSchema.pick({
 *  email: true,
 *  password: true
 * });
 */

import { z } from 'zod';
import { userValidation as uv } from './signup';

export const loginSchema = z.object({
  email: z
    .string('Enter your registered email')
    .trim()
    .regex(uv.email.regex, { message: 'Enter a valid email' }),
  password: z
    .string('Enter your password')
    .min(uv.password.minLength, { message: `Password must be between ${uv.password.minLength}-${uv.password.maxLength} characters.` })
    .regex(uv.password.regex, {
      message: `Password must be ${uv.password.minLength}-${uv.password.maxLength} characters and include an uppercase letter, a lowercase letter, a number, and a special character`
    }),
  agreeTnC: z.boolean('You must agree to the Terms and Privacy Policy').refine(value => value === true, {
    message: 'You must agree to the Terms and Privacy Policy'
  })
});

export type LoginFormData = z.infer<typeof loginSchema>;
