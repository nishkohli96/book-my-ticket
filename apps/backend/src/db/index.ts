import os from 'os';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ENV_CONFIG, isProductionEnv } from '@/constants';
import { winstonLogger } from '@/middleware';

const hostName = os.hostname();
const { user, host, password, db, port } = ENV_CONFIG.postgres;

const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${db}`;

export async function connectPostgresDB() {
  try {
    drizzle(postgresUrl);
    winstonLogger.info(`[ ⚡️ ${hostName} ⚡️ ] - Connected to Postgres`);
  } catch (error) {
    winstonLogger.error('⚠ Error connecting to Postgres Database ⚠', error);
    process.exit(1);
  }
}

export async function disconnectPostgresDB() {
  try {
    winstonLogger.info(
      `[ ⚡️ ${hostName} ⚡️ ] - Postgres Database connection closed successfully`
    );
  } catch (error) {
    winstonLogger.error(
      '⚠ Error disconnecting from Postgres Database ⚠',
      error
    );
    process.exit(1);
  }
}

/* Alter tables should not be allowed in "production" env. */
export const shouldAlterTable = !isProductionEnv;
