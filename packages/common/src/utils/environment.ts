/**
 * Ensure all environment variables are defined by pulling their
 * value either from `.env` file or using the `defaultValue`.
 */
export function defEnvVariable(varName: string, defaultValue?: string): string {
  const value = process.env[varName];
  if (value) {
    return value.trim();
  }
  if (defaultValue) {
    return defaultValue.trim();
  }
  throw new Error(`Missing required environment variable: ${varName}`);
}
