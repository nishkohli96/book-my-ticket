import {
  pgTable,
  pgEnum,
  text,
  varchar,
  timestamp,
  integer,
  numeric,
  primaryKey,
  uniqueIndex,
  index,
  jsonb,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  /**
	 * Auth.js generates this (cuid/uuid)
	 */
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  /**
   * Credentials-based signup support. Null for users who only ever
	 * used an OAuth provider — the presence of a hash is what makes
	 * password login valid.
   */
  passwordHash: text('password_hash'),
  phone: varchar('phone', { length: 15 }),
  city: varchar('city', { length: 120 }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
}, table => [
  uniqueIndex('users_email_unique').on(table.email),
]);
