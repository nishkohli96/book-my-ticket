import { z } from 'zod';

export const userValidation = {
  firstName: { minLength: 2, maxLength: 40 },
  lastName: { minLength: 1, maxLength: 50 },
  email: {
    regex: /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
  },
  password: {
    minLength: 8,
    maxLength: 20,
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_-])[A-Za-z\d!@#$%^&*(),.?":{}|<>_-]{8,20}$/
  }
};

export const signUpSchema = z.object({
  firstName: z
    .string('First name is required')
    .trim()
    .min(userValidation.firstName.minLength, { message: `First name must be at least ${userValidation.firstName.minLength} characters` })
    .max(userValidation.firstName.maxLength, { message: `First name must be at most ${userValidation.firstName.maxLength} characters` }),
  lastName: z
    .string('Last name is required')
    .trim()
    .min(userValidation.lastName.minLength, { message: `Last name must be at least ${userValidation.lastName.minLength} characters` })
    .max(userValidation.lastName.maxLength, { message: `Last name must be at most ${userValidation.lastName.maxLength} characters` }),
  email: z
    .string('Email is required')
    .trim()
    .regex(userValidation.email.regex, { message: 'Enter a valid email' }),
  password: z
    .string('Password is required')
    .min(userValidation.password.minLength, { message: `Password must be between ${userValidation.password.minLength}-${userValidation.password.maxLength} characters.` })
    .regex(userValidation.password.regex, {
      message: `Password must be ${userValidation.password.minLength}-${userValidation.password.maxLength} characters and include an uppercase letter, a lowercase letter, a number, and a special character`
    }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
