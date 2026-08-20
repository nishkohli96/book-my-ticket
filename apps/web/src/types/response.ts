/**
 * Response shape mirrors the backend's sendSuccessResponse/sendErrorResponse
 * (apps/user-service/src/utils/response.ts) so API consumers see one
 * consistent contract regardless of which layer produced the response.
 */

export type ApiSuccessOptions = {
  message?: string;
  statusCode?: number;
};

export type ApiErrorOptions = {
	message: string;
	statusCode?: number;
	error?: string;
	validationErrors?: string[];
};
