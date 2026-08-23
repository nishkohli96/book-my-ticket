import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    firstName: string;
    lastName: string;
    /**
     * Absent for Credentials sign-in (schema requires phone at signup).
     * Set for Google.
     */
    hasPhoneNumber?: boolean;
    /**
     * These four are all set in the `signIn` callback right before
     * they're read in `jwt` - never present on the actual OAuth/Credentials
     * user object itself.
     */
    sessionId?: string;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      hasPhoneNumber: boolean;
    } & DefaultSession['user'];
    /**
     * Short-lived by design (~15 min) - acceptable to expose to `auth()`
     * and client-side `useSession()`, unlike `refreshToken` which never
     * leaves the `jwt` callback. BFF routes send this as
     * `Authorization: Bearer` when calling user-service.
     */
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    hasPhoneNumber: boolean;
    sessionId: string;
    accessToken: string;
    accessTokenExpiresAt: number;
    /** Never exposed via the `session` callback - JWT-internal only. */
    refreshToken: string;
  }
}
