/**
 * By default, all properties are required. To make certain properties optional:
 * const Dog = z.object({
 *   name: z.string(),
 *   age: z.number().optional(),
 * });
 */

import { z } from 'zod';
import { formValidations as fv } from '@/constants/validation';

export const signUpSchema = z.object({
  firstName: z
    .string('First name is required')
    .trim()
    .min(fv.firstName.minLength, { message: `First name must be at least ${fv.firstName.minLength} characters` })
    .max(fv.firstName.maxLength, { message: `First name must be at most ${fv.firstName.maxLength} characters` }),
  lastName: z
    .string('Last name is required')
    .trim()
    .min(fv.lastName.minLength, { message: `Last name must be at least ${fv.lastName.minLength} characters` })
    .max(fv.lastName.maxLength, { message: `Last name must be at most ${fv.lastName.maxLength} characters` }),
  email: z
    .string('Email is required')
    .trim()
    .regex(fv.email.regex, { message: 'Enter a valid email' }),
  password: z
    .string('Password is required')
    .min(fv.password.minLength, { message: `Password must be between ${fv.password.minLength}-${fv.password.maxLength} characters.` })
    .regex(fv.password.regex, {
      message: `Password must be ${fv.password.minLength}-${fv.password.maxLength} characters and include an uppercase letter, a lowercase letter, a number, and a special character`
    }),
  agreeTnC: z.boolean('You must agree to the Terms and Privacy Policy').refine(value => value === true, {
    message: 'You must agree to the Terms and Privacy Policy'
  })
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
