import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { UserIdentityProvider } from '@book-my-ticket/common';
import { usersSchema } from './user';

export const identityProviderEnum = pgEnum('identity_provider', UserIdentityProvider);

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
    /** 'credentials' | 'google' | ... */
    provider: identityProviderEnum('provider')
      .notNull()
      .default(UserIdentityProvider.CREDENTIALS),
    /** The provider's own account id (e.g. Google's `sub`). Null for 'credentials'. */
    providerAccountId: text('provider_account_id'),
    createdAt: timestamp('created_at', { mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  table => [
    /**
     * For every credentials signup user gets a row like ('credentials', NULL).
     * The unique index on (provider, providerAccountId) never rejects that, no
     * matter how many users have it — each NULL counts as its own distinct value
     * for uniqueness purposes.
     */
    uniqueIndex('user_identities_provider_account_unique').on(
      table.provider,
      table.providerAccountId
    ),
    index('user_identities_user_id_idx').on(table.userId),
  ]
);
