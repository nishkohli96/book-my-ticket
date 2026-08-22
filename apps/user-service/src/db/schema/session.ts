import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { usersSchema } from './user';

/**
 * One active session per user for now (single-device login) - a new
 * sign-in revokes every prior row for that userId. Kept as a table (not
 * just a "current session id" column on users) so past sessions stay on
 * record for history/audit even after being revoked.
 */
export const userSessionsSchema = pgTable(
  'user_sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => usersSchema.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    lastSeenAt: timestamp('last_seen_at', { mode: 'date' }).notNull().defaultNow(),
    /** Null while active; set when superseded by a newer sign-in or explicit logout. */
    revokedAt: timestamp('revoked_at', { mode: 'date' }),
  },
  table => [index('user_sessions_user_id_idx').on(table.userId)]
);
