import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { usersSchema } from './user';

/**
 * One row per way a user can sign in - a password ('credentials') or an
 * OAuth provider account. A user can have multiple rows (e.g. password +
 * Google) once account-linking is built; today findOrCreateOAuthUser only
 * links by email, but this table is what makes real (provider,
 * providerAccountId) matching possible later without a schema change.
 */
export const userIdentitiesSchema = pgTable(
  'user_identities',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => usersSchema.id, { onDelete: 'cascade' }),
    /** 'credentials' | 'google' | 'apple' | ... */
    provider: text('provider').notNull(),
    /** The provider's own account id (e.g. Google's `sub`). Null for 'credentials'. */
    providerAccountId: text('provider_account_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  table => [
    uniqueIndex('user_identities_provider_account_unique').on(
      table.provider,
      table.providerAccountId
    ),
    index('user_identities_user_id_idx').on(table.userId),
  ]
);
