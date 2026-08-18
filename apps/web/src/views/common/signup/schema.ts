import { z } from 'zod';
import { formValidations as fv } from '@/constants/validation';

export const signUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(fv.firstName.minLength, { message: 'First name is required' })
    .max(fv.firstName.maxLength, { message: `First name must be at most ${fv.firstName.maxLength} characters` }),
  lastName: z
    .string()
    .trim()
    .min(fv.lastName.maxLength, { message: 'Last name is required' })
    .max(fv.lastName.maxLength, { message: `Last name must be at most ${fv.lastName.maxLength} characters` }),
  email: z
    .string()
    .trim()
    .regex(fv.email.regex, { message: 'Email is required' }),
  password: z
    .string()
    .regex(fv.password.regex, {
      message: `Password must be ${fv.password.minLength}-${fv.password.maxLength} characters and include an uppercase letter, a lowercase letter, a number, and a special character`
    }),
  agreeTnC: z.literal(true, {
    message: 'You must agree to the Terms and Privacy Policy'
  })
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
