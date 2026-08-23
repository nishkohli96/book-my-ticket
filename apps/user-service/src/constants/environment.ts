import { defEnvVariable } from '@book-my-ticket/common';

export const ENV_CONFIG = Object.freeze({
  env: defEnvVariable('NODE_ENV', 'development'),
  port: defEnvVariable('PORT', '8001'),
  corsOrigin: defEnvVariable('CORS_ORIGIN', 'http://localhost:3000'),
  ticketMasterApiKey: defEnvVariable('TICKETMASTER_API_KEY'),
  jwt: {
    secret: defEnvVariable('JWT_SECRET'),
    /** Short-lived - a stolen access token is only useful for this long. */
    accessTokenExpiry: defEnvVariable('JWT_ACCESS_TOKEN_EXPIRY', '15m'),
    /** How long an unused refresh token stays valid. */
    refreshTokenExpiryDays: Number(defEnvVariable('JWT_REFRESH_TOKEN_EXPIRY_DAYS', '30')),
  },
  postgres: {
    user: defEnvVariable('POSTGRES_USERNAME', 'postgres'),
    password: defEnvVariable('POSTGRES_PASSWORD', 'postgres'),
    host: defEnvVariable('POSTGRES_HOSTNAME', 'localhost'),
    port: defEnvVariable('POSTGRES_PORT', '5432'),
    db: defEnvVariable('POSTGRES_DB', 'postgres'),
  }
});

export const isProductionEnv = ENV_CONFIG.env === 'production';
