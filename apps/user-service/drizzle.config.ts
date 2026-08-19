/// <reference types="node" />

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const postgresUrl = `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOSTNAME}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}?sslmode=require`;

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  /**
   * Limits drizzle-kit to our own schema. Without this, `push` also
   * diffs against provider-managed schemas (e.g. Neon's `neon_auth`)
   * and can prompt to drop them - never confirm that.
   */
  schemaFilter: ['public'],
  dbCredentials: {
    url: postgresUrl,
  },
});
