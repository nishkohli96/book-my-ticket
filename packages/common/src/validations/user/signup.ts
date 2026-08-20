import { z } from 'zod';

export const userValidation = {
  firstName: { minLength: 2, maxLength: 40 },
  lastName: { minLength: 1, maxLength: 50 },
  phoneNumber: {
    minLength: 6,
    maxLength: 15,
    countryLength: 2,
    dialCodeMinLength: 2,
    dialCodeMaxLength: 4
  },
  email: {
    regex: /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
  },
  password: {
    minLength: 8,
    maxLength: 20,
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_-])[A-Za-z\d!@#$%^&*(),.?":{}|<>_-]{8,20}$/
  }
};

export const phoneValueSchema = z.object({
  /** Full E.164-style phone value with dial code, e.g. "+15551234567". */
  phone: z
    .string('Phone number is required')
    .min(userValidation.phoneNumber.minLength, 'Phone number is required')
    .max(userValidation.phoneNumber.maxLength, 'Phone number is required'),
  /** Selected ISO 3166-1 alpha-2 country code, e.g. "us" or "ca". */
  country: z
    .string()
    .length(userValidation.phoneNumber.countryLength, 'Country is required'),
  /** Country calling code without the "+" prefix, e.g. "1". */
  dialCode: z
    .string()
    .min(userValidation.phoneNumber.dialCodeMinLength, `Dial code must be atleast ${userValidation.phoneNumber.dialCodeMinLength} chars long.`)
    .max(userValidation.phoneNumber.dialCodeMaxLength, `Dial code must not be greater than ${userValidation.phoneNumber.dialCodeMaxLength} chars.`),
  /** National significant number with the dial code stripped. */
  phoneNo: z
    .string('Phone number is required')
    .min(userValidation.phoneNumber.minLength, 'Phone number is required')
    .max(userValidation.phoneNumber.maxLength, 'Phone number is required'),
});

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
  phoneNumber: phoneValueSchema,
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
