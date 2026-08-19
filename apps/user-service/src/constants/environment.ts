/**
 * Define all environment variables in this file and then
 * export across other modules.
 */

function defEnvVariable(varName: string, defaultValue?: string): string {
  const value = process.env[varName];
  if (value) {
    return value.trim();
  }
  if (defaultValue) {
    return defaultValue.trim();
  }
  throw new Error(`Missing required environment variable: ${varName}`);
}

export const ENV_CONFIG = Object.freeze({
  env: defEnvVariable('NODE_ENV', 'development'),
  port: defEnvVariable('PORT', '8000'),
  corsOrigin: defEnvVariable('CORS_ORIGIN', 'http://localhost:3000'),
  ticketMasterApiKey: defEnvVariable('TICKETMASTER_API_KEY'),
  postgres: {
    user: defEnvVariable('POSTGRES_USERNAME', 'postgres'),
    password: defEnvVariable('POSTGRES_PASSWORD', 'postgres'),
    host: defEnvVariable('POSTGRES_HOSTNAME', 'localhost'),
    port: defEnvVariable('POSTGRES_PORT', '5432'),
    db: defEnvVariable('POSTGRES_DB', 'postgres'),
  }
});

export const isProductionEnv = ENV_CONFIG.env === 'production';
