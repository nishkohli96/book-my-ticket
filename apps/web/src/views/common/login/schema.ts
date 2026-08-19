/**
 * You can also pick certain fields from an existing schema.
 * export const loginSchema = signUpSchema.pick({
 *  email: true,
 *  password: true
 * });
 */

import { z } from 'zod';
import { formValidations as fv } from '@/constants/validation';

export const loginSchema = z.object({
  email: z
    .string('Enter your registered email')
    .trim()
    .regex(fv.email.regex, { message: 'Enter a valid email' }),
  password: z
    .string('Enter your password')
    .min(fv.password.minLength, { message: `Password must be between ${fv.password.minLength}-${fv.password.maxLength} characters.` })
    .regex(fv.password.regex, {
      message: `Password must be ${fv.password.minLength}-${fv.password.maxLength} characters and include an uppercase letter, a lowercase letter, a number, and a special character`
    }),
  agreeTnC: z.boolean('You must agree to the Terms and Privacy Policy').refine(value => value === true, {
    message: 'You must agree to the Terms and Privacy Policy'
  })
});

export type LoginFormData = z.infer<typeof loginSchema>;
