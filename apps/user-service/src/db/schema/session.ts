import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { usersSchema } from './user';

/**
 * One active session per user for now (single-device login) - a new
 * sign-in revokes every prior row for that userId. Kept as a table (not
 * just a "current session id" column on users) so past sessions stay on
 * record for history/audit even after being revoked.
 *
 * Doubles as the refresh-token store: `refreshTokenHash` is the SHA-256
 * hash of the opaque refresh token handed to the client (never the raw
 * token itself). The short-lived access token is a stateless signed JWT
 * and isn't stored here at all - only the refresh token needs a DB row,
 * since that's the only thing that needs to be revocable.
 */
export const userSessionsSchema = pgTable(
  'user_sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => usersSchema.id, { onDelete: 'cascade' }),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp('last_seen_at', { mode: 'date' })
      .notNull()
      .defaultNow(),
    /** Null while active; set when superseded by a newer sign-in, a refresh (rotation), or explicit logout. */
    revokedAt: timestamp('revoked_at', { mode: 'date' }),
  },
  table => [
    index('user_sessions_user_id_idx').on(table.userId),
    uniqueIndex('user_sessions_refresh_token_hash_unique').on(table.refreshTokenHash),
  ]
);
