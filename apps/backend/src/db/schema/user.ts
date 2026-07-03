import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const usersSchema = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  passwordHash: text('password_hash'),
  phone: varchar('phone', { length: 20 }),
  city: varchar('city', { length: 120 }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
}, table => [
  uniqueIndex('users_email_unique').on(table.email),
]);

export const accountsSchema = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => usersSchema.id, {
    onDelete: 'cascade',
  }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
}, table => [
  primaryKey({ columns: [table.provider, table.providerAccountId] }),
  index('accounts_user_id_idx').on(table.userId),
]);

export const sessionsSchema = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => usersSchema.id, {
    onDelete: 'cascade',
  }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokensSchema = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, table => [
  primaryKey({ columns: [table.identifier, table.token] }),
]);
