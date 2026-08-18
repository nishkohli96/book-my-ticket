import Joi from 'joi';

export type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeTnC: boolean;
};

export const signUpSchema = Joi.object<SignUpFormValues>({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(72).required(),
  agreeTnC: Joi.boolean().valid(true).required()
});
