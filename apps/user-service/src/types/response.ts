export type SuccessResponseOptions = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

export type ErrorResponseOptions = {
  statusCode?: number;
  message?: string;
  error: unknown;
  /** Per-field/issue validation messages, shown to the client regardless of env. */
  validationErrors?: string[];
};
