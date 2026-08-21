import { defEnvVariable } from '@book-my-ticket/common';

export const ENV_CONFIG = Object.freeze({
  apiUrl: defEnvVariable('GATEWAY_URL', 'http://localhost:8000'),
});

export const apiServicesUrl = Object.freeze({
  user: `${ENV_CONFIG.apiUrl}/api/user`
});
