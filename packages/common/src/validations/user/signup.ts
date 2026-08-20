import { z } from 'zod';

export const userValidation = {
  firstName: { minLength: 2, maxLength: 40 },
  lastName: { minLength: 1, maxLength: 50 },
  phoneNumber: {
    minLength: 6,
    maxLength: 15,
    countryLength: 2,
    dialCodeMinLength: 1,
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

/**
 * Validated as one unit with a single root-level issue (not per sub-field)
 * so `errors.phoneNumber` is a plain `{ message }` FieldError - matching
 * every other field - instead of a nested `{ phone, country, ... }` errors
 * object with no `.message` of its own.
 */
export const phoneValueSchema = z
  .object({
    /** Full E.164-style phone value with dial code, e.g. "+15551234567". */
    phone: z.string(),
    /** Selected ISO 3166-1 alpha-2 country code, e.g. "us" or "ca". */
    country: z.string(),
    /** Country calling code without the "+" prefix, e.g. "1". */
    dialCode: z.string(),
    /** National significant number with the dial code stripped. */
    phoneNo: z.string(),
  })
  .superRefine((value, ctx) => {
    const addIssue = (message: string) => ctx.addIssue({ code: 'custom', message, path: [] });

    if (
      value.phone.length < userValidation.phoneNumber.minLength
      || value.phone.length > userValidation.phoneNumber.maxLength
    ) {
      return addIssue('Phone number is required');
    }
    if (value.country.length !== userValidation.phoneNumber.countryLength) {
      return addIssue('Select a country');
    }
    if (
      value.dialCode.length < userValidation.phoneNumber.dialCodeMinLength
      || value.dialCode.length > userValidation.phoneNumber.dialCodeMaxLength
    ) {
      return addIssue('Select a valid country dial code');
    }
    if (
      value.phoneNo.length < userValidation.phoneNumber.minLength
      || value.phoneNo.length > userValidation.phoneNumber.maxLength
    ) {
      return addIssue('Phone number is required');
    }
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
