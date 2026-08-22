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
    /** Set in the `signIn` callback right before it's read in `jwt`. */
    sessionId?: string;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      hasPhoneNumber: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    hasPhoneNumber: boolean;
    sessionId: string;
  }
}
