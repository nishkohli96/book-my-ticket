import { z } from '@book-my-ticket/types';
import { signUpSchema as sharedSignUpSchema } from '@book-my-ticket/types/user';

export const signUpSchema = sharedSignUpSchema.extend({
  agreeTnC: z.boolean('You must agree to the Terms and Privacy Policy').refine(value => value === true, {
    message: 'You must agree to the Terms and Privacy Policy'
  })
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
