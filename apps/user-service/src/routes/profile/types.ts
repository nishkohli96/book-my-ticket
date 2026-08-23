import type { EditProfileFormData } from '@book-my-ticket/common';
import { type Request } from 'express';

export type UpdateProfileRequest = Request<object, object, EditProfileFormData>;

export type GetProfileRequest = Request;
