import { z } from 'zod';
import { signUpSchema as schema } from '@book-my-ticket/common';

export const signUpSchema = schema.extend({
  agreeTnC: z
    .boolean('You must agree to the Terms and Privacy Policy')
    .refine(value => value === true, {
      message: 'You must agree to the Terms and Privacy Policy'
    })
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
