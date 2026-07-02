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
  ticketMasterApiKey: defEnvVariable('TICKETMASTER_API_KEY')
});
