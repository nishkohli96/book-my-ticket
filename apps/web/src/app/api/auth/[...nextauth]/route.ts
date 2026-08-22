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
import { loginSchema, oauthSignInSchema } from '@book-my-ticket/common';
import { ENV_CONFIG, apiServicesUrl } from '@/constants/environment';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: ENV_CONFIG.google.clientId,
      clientSecret: ENV_CONFIG.google.secret,
      profile(profile) {
        return {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name ?? '',
          email: profile.email,
          image: profile.picture,
        };
      }
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
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
        return true;
      }

      const parsedUser = oauthSignInSchema.safeParse(user);
      if (!parsedUser.success) {
        return false;
      }

      const response = await fetch(`${apiServicesUrl.user}/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedUser.data)
      });
      if (!response.ok) {
        return false;
      }

      const { data } = await response.json();
      user.id = data.id;
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.hasPhoneNumber = data.hasPhoneNumber;
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.hasPhoneNumber = user.hasPhoneNumber ?? true;
      }
      if (trigger === 'update' && session) {
        token.firstName = session.firstName ?? token.firstName;
        token.lastName = session.lastName ?? token.lastName;
        token.hasPhoneNumber = session.hasPhoneNumber ?? token.hasPhoneNumber;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.hasPhoneNumber = token.hasPhoneNumber as boolean;
      }
      return session;
    }
  }
});

export const { GET, POST } = handlers;
