import type { SignUpFormData } from '@/validations';

export type UserLoginDetails = Pick<
  SignUpFormData,
  'email' | 'firstName' | 'lastName'
> & { id: string };
