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
import {
  loginSchema,
  oauthSignInSchema,
  UserIdentityProvider
} from '@book-my-ticket/common';
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
      if (account?.provider === UserIdentityProvider.GOOGLE) {
        const parsedUser = oauthSignInSchema.safeParse({
          provider: UserIdentityProvider.GOOGLE,
          providerAccountId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.image,
        });
        if (!parsedUser.success) {
          return false;
        }

        const oauthResponse = await fetch(`${apiServicesUrl.user}/auth/oauth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedUser.data)
        });
        if (!oauthResponse.ok) {
          return false;
        }

        const { data } = await oauthResponse.json();
        user.id = data.id;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.hasPhoneNumber = data.hasPhoneNumber;
        user.image = data.avatar;
      }

      /**
       * Single-active-session enforcement: every sign-in (any provider)
       * revokes the user's prior session and mints a fresh access +
       * refresh token pair. The access token is what BFF routes send to
       * user-service as `Authorization: Bearer` - the refresh token is
       * only ever used here in `jwt` below to get a new pair once the
       * access token expires.
       */
      const sessionResponse = await fetch(`${apiServicesUrl.user}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (!sessionResponse.ok) {
        return false;
      }

      const { data: session } = await sessionResponse.json();
      user.sessionId = session.sessionId;
      user.accessToken = session.accessToken;
      user.accessTokenExpiresAt = session.accessTokenExpiresAt;
      user.refreshToken = session.refreshToken;
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.hasPhoneNumber = user.hasPhoneNumber ?? true;
        token.sessionId = user.sessionId as string;
        token.accessToken = user.accessToken as string;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt as number;
        token.refreshToken = user.refreshToken as string;
      } else if (Date.now() >= (token.accessTokenExpiresAt as number)) {
        const response = await fetch(`${apiServicesUrl.user}/sessions/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: token.refreshToken })
        });
        if (!response.ok) {
          return null;
        }

        const { data } = await response.json();
        token.sessionId = data.sessionId;
        token.accessToken = data.accessToken;
        token.accessTokenExpiresAt = data.accessTokenExpiresAt;
        token.refreshToken = data.refreshToken;
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
      session.accessToken = token.accessToken as string;
      return session;
    }
  },
  events: {
    async signOut(message) {
      const sessionId = 'token' in message ? message.token?.sessionId : undefined;
      if (!sessionId) {
        return;
      }
      await fetch(`${apiServicesUrl.user}/sessions/${sessionId as string}`, { method: 'DELETE' });
    }
  }
});

export const { GET, POST } = handlers;
