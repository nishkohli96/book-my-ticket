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
    passwordHash: text('password_hash'),
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
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  table => [uniqueIndex('users_email_unique').on(table.email)]
);

// export const accountsSchema = pgTable(
//   'accounts',
//   {
//     userId: text('user_id')
//       .notNull()
//       .references(() => usersSchema.id, {
//         onDelete: 'cascade',
//       }),
//     type: text('type').notNull(),
//     provider: text('provider').notNull(),
//     providerAccountId: text('provider_account_id').notNull(),
//     refreshToken: text('refresh_token'),
//     accessToken: text('access_token'),
//     expiresAt: integer('expires_at'),
//     tokenType: text('token_type'),
//     scope: text('scope'),
//     idToken: text('id_token'),
//     sessionState: text('session_state'),
//   },
//   table => [
//     primaryKey({ columns: [table.provider, table.providerAccountId] }),
//     index('accounts_user_id_idx').on(table.userId),
//   ]
// );

// export const sessionsSchema = pgTable('sessions', {
//   sessionToken: text('session_token').primaryKey(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => usersSchema.id, {
//       onDelete: 'cascade',
//     }),
//   expires: timestamp('expires', { mode: 'date' }).notNull(),
// });

// export const verificationTokensSchema = pgTable(
//   'verification_tokens',
//   {
//     identifier: text('identifier').notNull(),
//     token: text('token').notNull(),
//     expires: timestamp('expires', { mode: 'date' }).notNull(),
//   },
//   table => [primaryKey({ columns: [table.identifier, table.token] })]
// );
