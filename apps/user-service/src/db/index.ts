import os from 'os';
import { Pool } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ENV_CONFIG } from '@/constants';
import { winstonLogger } from '@/middleware';

const hostName = os.hostname();
const { user, host, password, db: database, port } = ENV_CONFIG.postgres;

class PostgresDatabase {
  private pool: Pool | null = null;
  private drizzleDb: NodePgDatabase | null = null;

  get db() {
    if (!this.drizzleDb) {
      throw new Error('Postgres is not connected. Call connectPostgresDB first.');
    }
    return this.drizzleDb;
  }

  async connect() {
    if (this.pool && this.drizzleDb) {
      return this.drizzleDb;
    }

    this.pool = new Pool({
      user,
      host,
      password,
      database,
      port: Number(port),
      ssl: true
    });

    const client = await this.pool.connect();
    try {
      await client.query('select 1');
      this.drizzleDb = drizzle({ client: this.pool });
      winstonLogger.info(`[ ⚡️ ${hostName} ⚡️ ] - Connected to Postgres`);
      return this.drizzleDb;
    } finally {
      client.release();
    }
  }

  async disconnect() {
    if (!this.pool) {
      return;
    }
    await this.pool.end();
    this.pool = null;
    this.drizzleDb = null;
    winstonLogger.info(
      `[ ⚡️ ${hostName} ⚡️ ] - Postgres Database connection closed successfully`
    );
  }
}

export const postgresDatabase = new PostgresDatabase();
