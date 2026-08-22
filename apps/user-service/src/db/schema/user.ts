/**
 * Re-run the below command any time schema (or the DB itself) drifts from src/db/schema/
 * cd apps/user-service && npx drizzle-kit push
 */

import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { userValidation } from '@book-my-ticket/common';

export const usersSchema = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    // emailVerified: timestamp('email_verified', { mode: 'date' }),
    // avatar: text('image'),
    /** Null for OAuth-only accounts (e.g. Google sign-in) with no password. */
    passwordHash: text('password_hash'),
    /**
     * Phone fields are all nullable - OAuth sign-in creates a user row
     * before a phone number is collected. Collected afterward via the
     * edit-profile flow.
     */
    /** Full E.164-style phone value with dial code, e.g. "+15551234567". */
    phone: varchar('phone', {
      length: userValidation.phoneNumber.maxLength,
    }),
    /** Selected ISO 3166-1 alpha-2 country code, e.g. "us" or "ca". */
    phoneCountry: varchar('phone_country', {
      length: userValidation.phoneNumber.countryLength,
    }),
    /** Country calling code without the "+" prefix, e.g. "1". */
    phoneDialCode: varchar('phone_dial_code', {
      length: userValidation.phoneNumber.dialCodeMaxLength,
    }),
    /** National significant number with the dial code stripped. */
    phoneNo: varchar('phone_no', {
      length: userValidation.phoneNumber.maxLength,
    }),
    /** Soft-delete flag - set false instead of deleting the row. */
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  table => [uniqueIndex('users_email_unique').on(table.email)]
);
