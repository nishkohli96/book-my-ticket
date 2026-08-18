import Joi from 'joi';

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginSchema = Joi.object<LoginFormValues>({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(72).required()
});
