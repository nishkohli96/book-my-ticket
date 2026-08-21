/**
 * Next-Auth Docs:
 * - Credentials: https://next-auth.js.org/providers/credentials
 * - Google: https://next-auth.js.org/providers/google
 *
 * import Google from 'next-auth/providers/google';
 * providers: [Google]
 *
 * Reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET automatically, but only for
 * the specific AUTH_<PROVIDER>_ID / AUTH_<PROVIDER>_SECRET names,
 * and only when you call the provider as a bare reference, not invoked with config.
 */

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@book-my-ticket/common';
import { ENV_CONFIG, apiServicesUrl } from '@/constants';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: ENV_CONFIG.google.clientId,
      clientSecret: ENV_CONFIG.google.secret
    }),
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const response = await fetch(`${apiServicesUrl.user}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedCredentials.data)
        });
        if (!response.ok) {
          return null;
        }
        const { data } = await response.json();
        return data;
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      if (trigger === 'update' && session) {
        token.firstName = session.firstName ?? token.firstName;
        token.lastName = session.lastName ?? token.lastName;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    }
  }
});

export const { GET, POST } = handlers;
