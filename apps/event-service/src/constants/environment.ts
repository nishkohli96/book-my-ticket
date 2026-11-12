import { defEnvVariable } from '@book-my-ticket/common';

export const ENV_CONFIG = Object.freeze({
  env: defEnvVariable('NODE_ENV', 'development'),
  port: defEnvVariable('PORT', '8002'),
  corsOrigin: defEnvVariable('CORS_ORIGIN', 'http://localhost:3000'),
  postgres: {
    user: defEnvVariable('POSTGRES_USERNAME', 'postgres'),
    password: defEnvVariable('POSTGRES_PASSWORD', 'postgres'),
    host: defEnvVariable('POSTGRES_HOSTNAME', 'localhost'),
    port: defEnvVariable('POSTGRES_PORT', '5432'),
    db: defEnvVariable('POSTGRES_DB', 'postgres'),
  }
});
